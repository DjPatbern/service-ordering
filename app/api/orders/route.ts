import { orderInputSchema } from "@/features/store/schema";
import { createOrder } from "@/lib/server/orders";
import { assertOrigin, readJson, rateLimit, failure } from "@/lib/server/http";
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    await rateLimit(request, "order", 10);
    const input = orderInputSchema.parse(await readJson(request));
    return Response.json(
      await createOrder(input, new URL(request.url).origin),
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    return failure(error);
  }
}
