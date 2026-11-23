import { z } from "zod";
import { requireAdmin } from "@/lib/server/auth";
import { assertOrigin, failure, readJson } from "@/lib/server/http";
import { deleteOrder, updateOrder } from "@/lib/server/orders";
import { statuses } from "@/features/store/schema";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertOrigin(request);
    await requireAdmin();
    const { id } = await params;
    const input = z
      .object({
        status: z.enum(statuses),
        shipping: z.number().int().min(0).max(100000000).optional(),
        note: z.string().trim().max(500).optional(),
        confirmReceived: z.boolean().optional(),
      })
      .parse(await readJson(request));
    await updateOrder(id, input);
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertOrigin(request);
    await requireAdmin();
    await deleteOrder((await params).id);
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
