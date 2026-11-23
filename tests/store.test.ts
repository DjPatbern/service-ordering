import { describe, expect, it } from "vitest";
import {
  canTransition,
  orderInputSchema,
  priceOrder,
  productSchema,
} from "@/features/store/schema";
import { seedProducts } from "@/features/store/seed";
import { naira } from "@/lib/brand";

describe("store domain", () => {
  it("ships supplied offers as published but enquiry-only", () => {
    expect(seedProducts).toHaveLength(5);
    expect(
      seedProducts.every(
        (product) =>
          product.published && !product.purchasable && product.stock === 0,
      ),
    ).toBe(true);
  });

  it("prices a confirmed order from server products", () => {
    const product = {
      ...seedProducts[0],
      purchasable: true,
      stock: 3,
    };
    expect(
      priceOrder([{ slug: product.slug, quantity: 2 }], [product]),
    ).toEqual([
      expect.objectContaining({
        price: 145000000,
        total: 290000000,
        quantity: 2,
      }),
    ]);
  });

  it("rejects disabled, unpublished, missing and insufficient products", () => {
    expect(() =>
      priceOrder([{ slug: seedProducts[0].slug, quantity: 1 }], seedProducts),
    ).toThrow(/unavailable/);
    expect(() =>
      priceOrder([{ slug: "missing-product", quantity: 1 }], seedProducts),
    ).toThrow(/unavailable/);
    const enabled = { ...seedProducts[0], purchasable: true, stock: 1 };
    expect(() =>
      priceOrder([{ slug: enabled.slug, quantity: 2 }], [enabled]),
    ).toThrow(/quantity/);
  });

  it("accepts a complete Nigerian delivery request", () => {
    const parsed = orderInputSchema.safeParse({
      idempotencyKey: crypto.randomUUID(),
      consent: true,
      items: [{ slug: "itel-power-tank-500w", quantity: 1 }],
      customer: {
        name: "Isaac Peters",
        phone: "08133872007",
        email: "isaac@example.com",
        address: "12 Sample Street, beside the town hall",
        city: "Ikeja",
        state: "Lagos",
        notes: "",
      },
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects duplicate items, invalid contact details and missing consent", () => {
    const item = { slug: "itel-power-tank-500w", quantity: 1 };
    const result = orderInputSchema.safeParse({
      idempotencyKey: crypto.randomUUID(),
      consent: false,
      items: [item, item],
      customer: {
        name: "A",
        phone: "123",
        email: "not-an-email",
        address: "short",
        city: "L",
        state: "Lagos",
        notes: "",
      },
    });
    expect(result.success).toBe(false);
  });

  it("enforces valid order state transitions", () => {
    expect(canTransition("awaiting_delivery_quote", "awaiting_payment")).toBe(
      true,
    );
    expect(canTransition("awaiting_delivery_quote", "paid")).toBe(false);
    expect(canTransition("payment_submitted", "paid")).toBe(true);
    expect(canTransition("paid", "completed")).toBe(false);
    expect(canTransition("dispatched", "completed")).toBe(true);
  });

  it("validates safe product records and formats naira", () => {
    expect(productSchema.safeParse(seedProducts[0]).success).toBe(true);
    expect(
      productSchema.safeParse({
        ...seedProducts[0],
        image: "https://attacker.example/image.jpg",
      }).success,
    ).toBe(false);
    expect(naira(44900000)).toBe("₦449,000");
  });
});
