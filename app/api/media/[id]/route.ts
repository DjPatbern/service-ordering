import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/auth";
import { failure, HttpError } from "@/lib/server/http";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/.test(id))
      throw new HttpError(404, "Image not found.");
    const db = await getDb();
    const file = await db
      .collection("media")
      .findOne({ _id: new ObjectId(id) }, { projection: { kind: 1 } });
    if (!file) throw new HttpError(404, "Image not found.");
    if (file.kind !== "product") await requireAdmin();
    const data = await db.collection("media").findOne({ _id: file._id });
    if (!data) throw new HttpError(404, "Image not found.");
    return new Response(new Uint8Array(data.data.buffer), {
      headers: {
        "Content-Type": "image/webp",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline; filename=image.webp",
        "Cache-Control":
          file.kind === "product"
            ? "public, max-age=86400, immutable"
            : "private, no-store",
      },
    });
  } catch (error) {
    return failure(error);
  }
}
