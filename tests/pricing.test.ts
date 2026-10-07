import { describe, expect, it } from "vitest";
import { calculateOrder } from "@/features/cart/pricing";
import { checkoutSchema } from "@/features/checkout/schema";
import { money } from "@/lib/markets";
describe("order pricing", () => {
  it("calculates variations, quantities and tax in minor units", () => {
    const order = calculateOrder(
      [{ slug: "branded-mugs", optionId: "signature", quantity: 3 }],
      "ng",
    );
    expect(order.subtotal).toBe(3120000);
    expect(order.tax).toBe(234000);
    expect(order.total).toBe(3354000);
  });
  it("uses local prices and rounds tax only after calculating the subtotal", () => {
    const order = calculateOrder(
      [{ slug: "business-cards", optionId: "250", quantity: 1 }],
      "us",
    );
    expect(order.subtotal).toBe(7350);
    expect(order.tax).toBe(588);
    expect(order.total).toBe(7938);
  });
  it("rejects unavailable services and options", () => {
    expect(() =>
      calculateOrder(
        [{ slug: "missing", optionId: "essential", quantity: 1 }],
        "ng",
      ),
    ).toThrow();
    expect(() =>
      calculateOrder(
        [{ slug: "branded-mugs", optionId: "missing", quantity: 1 }],
        "ng",
      ),
    ).toThrow();
  });
  it.each([0, -1, 1.2, 100, NaN])("rejects invalid quantity %s", (quantity) => {
    expect(() =>
      calculateOrder(
        [{ slug: "branded-mugs", optionId: "essential", quantity }],
        "ng",
      ),
    ).toThrow();
  });
  it("returns zero totals for an empty cart", () => {
    expect(calculateOrder([], "ca")).toMatchObject({
      subtotal: 0,
      tax: 0,
      total: 0,
    });
  });
  it("formats fractional currencies without losing cents", () => {
    expect(money(7938, "us")).toBe("$79.38");
  });
  it("rejects duplicate lines and an empty checkout", () => {
    const item = { slug: "branded-mugs", optionId: "essential", quantity: 1 };
    const contact = { name: "Alex Morgan", email: "alex@example.test" };
    expect(
      checkoutSchema.safeParse({ market: "ng", contact, items: [item, item] })
        .success,
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ market: "ng", contact, items: [] }).success,
    ).toBe(false);
  });
});
