import { z } from "zod";
import { ObjectId } from "mongodb";
import { assertOrigin, failure, rateLimit, HttpError } from "@/lib/server/http";
import { getOrderByToken, type OrderDocument } from "@/lib/server/orders";
import { getDb } from "@/lib/server/db";
import { readUpload, saveImage } from "@/lib/server/uploads";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    assertOrigin(request);
    await rateLimit(request, "payment-proof", 10);
    const { token } = await params;
    const order = await getOrderByToken(token);
    if (!order) throw new HttpError(404, "Order not found.");
    if (
      !["awaiting_payment", "payment_rejected"].includes(order.status) ||
      order.total === null
    )
      throw new HttpError(
        409,
        "This order is not ready for a new payment proof.",
      );
    const { form, file } = await readUpload(request);
    const input = z
      .object({
        payerName: z.string().trim().min(2).max(120),
        transferReference: z.string().trim().min(3).max(150),
      })
      .parse(Object.fromEntries(form));
    const id = await saveImage(file, "proof");
    const db = await getDb();
    const updated = await db.collection<OrderDocument>("orders").updateOne(
      { _id: order._id, status: order.status },
      {
        $set: {
          proofId: id,
          ...input,
          status: "payment_submitted",
          updatedAt: new Date(),
        },
        $push: {
          history: {
            at: new Date(),
            message:
              "Payment proof received. Our team will verify the bank credit before confirming payment.",
          },
        },
      },
    );
    if (!updated.modifiedCount) {
      await db.collection("media").deleteOne({ _id: new ObjectId(id) });
      throw new HttpError(409, "The order changed. Please refresh.");
    }
    if (order.proofId)
      await db
        .collection("media")
        .deleteOne({ _id: new ObjectId(order.proofId) });
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
