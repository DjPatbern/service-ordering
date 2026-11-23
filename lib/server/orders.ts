import "server-only";
import { ObjectId } from "mongodb";
import { createHmac, randomBytes } from "node:crypto";
import { getDb, getClient } from "./db";
import { hash, HttpError } from "./http";
import {
  orderInputSchema,
  priceOrder,
  canTransition,
  type OrderStatus,
  type OrderLine,
} from "@/features/store/schema";
import { getProducts } from "./catalog";
import { naira, whatsappFor } from "@/lib/brand";
import type { z } from "zod";
export type OrderDocument = {
  _id: ObjectId;
  reference: string;
  accessSeed: string;
  tokenHash: string;
  idempotencyHash: string;
  requestHash: string;
  customer: z.infer<typeof orderInputSchema>["customer"];
  lines: OrderLine[];
  subtotal: number;
  shipping: number | null;
  total: number | null;
  status: OrderStatus;
  reserved: boolean;
  createdAt: Date;
  updatedAt: Date;
  proofId?: string;
  payerName?: string;
  transferReference?: string;
  tracking?: string;
  history: { at: Date; message: string }[];
};
export function accessToken(seed: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32)
    throw new HttpError(
      503,
      "Checkout is not configured yet. Please contact Zhoppin.",
    );
  return createHmac("sha256", secret)
    .update(`zhoppin-order:${seed}`)
    .digest("hex");
}
function whatsappOrder(order: OrderDocument, token: string, origin: string) {
  const trackingUrl = `${origin}/orders/${token}`;
  const items = order.lines
    .map((line) => `• ${line.quantity} × ${line.name} — ${naira(line.total)}`)
    .join("\n");
  const message = [
    `Hello Zhoppin 👋 I’d like to complete order *${order.reference}* on WhatsApp.`,
    "",
    "*MY CART*",
    items,
    `*Product subtotal:* ${naira(order.subtotal)}`,
    "*Delivery:* To be confirmed",
    "",
    "*DELIVERY DETAILS*",
    `${order.customer.name} · ${order.customer.phone}`,
    `${order.customer.address}, ${order.customer.city}, ${order.customer.state}`,
    order.customer.notes ? `Note: ${order.customer.notes}` : "",
    "",
    `*Track this order:* ${trackingUrl}`,
    "Please confirm availability, delivery cost and next steps.",
  ]
    .filter((line, index, all) => line !== "" || all[index - 1] !== "")
    .join("\n");
  return {
    token,
    reference: order.reference,
    trackingUrl,
    whatsappUrl: whatsappFor(message),
  };
}

export async function createOrder(
  input: z.infer<typeof orderInputSchema>,
  origin: string,
) {
  const db = await getDb();
  const orders = db.collection<OrderDocument>("orders");
  const idempotencyHash = hash(input.idempotencyKey);
  const token = accessToken(input.idempotencyKey);
  const requestHash = hash(
    JSON.stringify({ customer: input.customer, items: input.items }),
  );
  const existing = await orders.findOne({ idempotencyHash });
  if (existing) {
    if (existing.requestHash !== requestHash)
      throw new HttpError(
        409,
        "This checkout has changed. Please refresh and try again.",
      );
    return whatsappOrder(existing, token, origin);
  }
  let lines: OrderLine[];
  try {
    lines = priceOrder(input.items, await getProducts());
  } catch (error) {
    throw new HttpError(
      409,
      error instanceof Error ? error.message : "Please review your cart.",
    );
  }
  const now = new Date();
  const reference = `ZH-${randomBytes(5).toString("hex").toUpperCase()}`;
  const order: OrderDocument = {
    _id: new ObjectId(),
    reference,
    accessSeed: input.idempotencyKey,
    tokenHash: hash(token),
    idempotencyHash,
    requestHash,
    customer: input.customer,
    lines,
    subtotal: lines.reduce((sum, line) => sum + line.total, 0),
    shipping: null,
    total: null,
    status: "awaiting_delivery_quote",
    reserved: false,
    createdAt: now,
    updatedAt: now,
    history: [
      {
        at: now,
        message:
          "Order request created and handed off to WhatsApp. Delivery cost and stock will be confirmed in the chat.",
      },
    ],
  };
  try {
    await orders.insertOne(order);
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "code" in error &&
      error.code === 11000
    ) {
      const saved = await orders.findOne({ idempotencyHash });
      if (saved?.requestHash === requestHash)
        return whatsappOrder(saved, token, origin);
    }
    throw error;
  }
  return whatsappOrder(order, token, origin);
}
export async function getOrderByToken(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  return (await getDb())
    .collection<OrderDocument>("orders")
    .findOne({ tokenHash: hash(token) });
}
export async function updateOrder(
  id: string,
  action: {
    status: OrderStatus;
    shipping?: number;
    note?: string;
    confirmReceived?: boolean;
  },
) {
  if (!ObjectId.isValid(id)) throw new HttpError(404, "Order not found.");
  const client = await getClient();
  const db = await getDb();
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const orders = db.collection<OrderDocument>("orders");
      const order = await orders.findOne(
        { _id: new ObjectId(id) },
        { session },
      );
      if (!order) throw new HttpError(404, "Order not found.");
      if (
        !canTransition(order.status, action.status) ||
        action.status === "payment_submitted"
      )
        throw new HttpError(
          409,
          "This order changed. Refresh and choose a valid next step.",
        );
      const changes: Partial<OrderDocument> = {
        status: action.status,
        updatedAt: new Date(),
      };
      if (action.status === "awaiting_payment") {
        if (
          action.shipping === undefined ||
          !Number.isSafeInteger(action.shipping) ||
          action.shipping < 0
        )
          throw new HttpError(400, "Enter the confirmed delivery fee.");
        for (const line of order.lines) {
          const result = await db.collection("products").updateOne(
            {
              slug: line.slug,
              published: true,
              purchasable: true,
              stock: { $gte: line.quantity },
            },
            { $inc: { stock: -line.quantity } },
            { session },
          );
          if (!result.matchedCount)
            throw new HttpError(
              409,
              `Not enough confirmed stock for ${line.name}. Update inventory before confirming delivery.`,
            );
        }
        changes.shipping = action.shipping;
        changes.total = order.subtotal + action.shipping;
        changes.reserved = true;
      }
      if (action.status === "paid" && !action.confirmReceived)
        throw new HttpError(
          400,
          "Check the bank account and explicitly confirm that funds were received. A WhatsApp receipt alone is not payment verification.",
        );
      if (action.status === "payment_rejected" && !action.note?.trim())
        throw new HttpError(400, "Explain what the customer should correct.");
      if (action.status === "dispatched" && !action.note?.trim())
        throw new HttpError(
          400,
          "Add the courier and tracking or delivery details.",
        );
      if (action.status === "dispatched") changes.tracking = action.note;
      if (action.status === "cancelled" && order.reserved) {
        for (const line of order.lines)
          await db
            .collection("products")
            .updateOne(
              { slug: line.slug },
              { $inc: { stock: line.quantity } },
              { session },
            );
        changes.reserved = false;
      }
      const updated = await orders.updateOne(
        { _id: order._id, status: order.status },
        {
          $set: changes,
          $push: {
            history: {
              at: new Date(),
              message:
                action.note ||
                (action.status === "awaiting_payment"
                  ? "Stock reserved and delivery confirmed. Your total is ready for bank transfer."
                  : `Order updated: ${action.status.replaceAll("_", " ")}.`),
            },
          },
        },
        { session },
      );
      if (!updated.modifiedCount)
        throw new HttpError(
          409,
          "This order changed while you were updating it. Refresh and try again.",
        );
    });
  } finally {
    await session.endSession();
  }
}

export async function deleteOrder(id: string) {
  if (!ObjectId.isValid(id)) throw new HttpError(404, "Order not found.");
  const client = await getClient();
  const db = await getDb();
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const orders = db.collection<OrderDocument>("orders");
      const order = await orders.findOne(
        { _id: new ObjectId(id) },
        { session },
      );
      if (!order) throw new HttpError(404, "Order not found.");

      const saleCompleted = ["paid", "dispatched", "completed"].includes(
        order.status,
      );
      if (order.reserved && !saleCompleted) {
        for (const line of order.lines)
          await db
            .collection("products")
            .updateOne(
              { slug: line.slug },
              { $inc: { stock: line.quantity } },
              { session },
            );
      }

      if (order.proofId && ObjectId.isValid(order.proofId))
        await db
          .collection("media")
          .deleteOne({ _id: new ObjectId(order.proofId) }, { session });

      const deleted = await orders.deleteOne({ _id: order._id }, { session });
      if (!deleted.deletedCount)
        throw new HttpError(
          409,
          "This order changed while it was being deleted. Refresh and try again.",
        );
    });
  } finally {
    await session.endSession();
  }
}
