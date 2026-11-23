import { requireAdmin } from "@/lib/server/auth";
import { assertOrigin, failure } from "@/lib/server/http";
import { importSeedProducts } from "@/lib/server/catalog";
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    await requireAdmin();
    await importSeedProducts();
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
