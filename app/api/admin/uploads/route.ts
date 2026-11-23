import { requireAdmin } from "@/lib/server/auth";
import { assertOrigin, failure, rateLimit } from "@/lib/server/http";
import { readUpload, saveImage } from "@/lib/server/uploads";
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    await requireAdmin();
    await rateLimit(request, "product-upload", 40);
    const { file } = await readUpload(request);
    const id = await saveImage(file, "product");
    return Response.json({ url: `/api/media/${id}` });
  } catch (error) {
    return failure(error);
  }
}
