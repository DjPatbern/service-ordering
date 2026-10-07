import { checkoutSchema, type Confirmation } from "@/features/checkout/schema";
import { calculateOrder } from "@/features/cart/pricing";
export async function POST(request: Request) {
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 32000)
      return Response.json(
        {
          error:
            "This order is too large. Please reduce the number of services.",
        },
        { status: 413 },
      );
    body = JSON.parse(raw);
  } catch {
    return Response.json(
      { error: "We couldn’t read your order. Please try again." },
      { status: 400 },
    );
  }
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success)
    return Response.json(
      {
        error:
          parsed.error.issues[0]?.message || "Please check your order details.",
      },
      { status: 400 },
    );
  try {
    // Never trust browser-supplied prices. Recalculate against the catalogue.
    const order = calculateOrder(parsed.data.items, parsed.data.market);
    const confirmation: Confirmation = {
      id: `BR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      market: parsed.data.market,
      createdAt: new Date().toISOString(),
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      lines: order.lines.map((line) => ({
        slug: line.slug,
        name: line.service.name,
        option: line.option.name,
        quantity: line.quantity,
        total: line.total,
      })),
    };
    // Demo only: no payment, emails, customer-data persistence or fulfilment.
    return Response.json(confirmation, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "We couldn’t calculate this order.",
      },
      { status: 400 },
    );
  }
}
