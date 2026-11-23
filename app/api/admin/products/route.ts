import { requireAdmin } from "@/lib/server/auth";
import { assertOrigin, failure, readJson, HttpError } from "@/lib/server/http";
import { getDb } from "@/lib/server/db";
import { productSchema } from "@/features/store/schema";
import { ObjectId } from "mongodb";
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    await requireAdmin();
    const product = productSchema.parse(await readJson(request));
    const db = await getDb();
    const category = await db
      .collection("categories")
      .findOne({ name: product.category });
    if (!category)
      throw new HttpError(400, "Choose an existing product category.");
    if (product.image.startsWith("/api/media/")) {
      const media = await db.collection("media").findOne({
        _id: new ObjectId(product.image.split("/").at(-1)),
        kind: "product",
      });
      if (!media)
        throw new HttpError(400, "Please upload a product image first.");
    }
    if (product.featured)
      await db
        .collection("products")
        .updateMany(
          { slug: { $ne: product.slug } },
          { $set: { featured: false } },
        );
    await db.collection("products").updateOne(
      { slug: product.slug },
      {
        $set: { ...product, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
export async function DELETE(request: Request) {
  try {
    assertOrigin(request);
    await requireAdmin();
    const slug = new URL(request.url).searchParams.get("slug") || "";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      throw new HttpError(400, "Invalid product.");
    const result = await (
      await getDb()
    )
      .collection("products")
      .deleteOne({ slug });
    if (!result.deletedCount) throw new HttpError(404, "Product not found.");
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
