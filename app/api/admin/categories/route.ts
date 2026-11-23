import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { assertOrigin, failure, HttpError, readJson } from "@/lib/server/http";
import { categoryNameSchema, categorySchema } from "@/features/store/schema";

export async function POST(request: Request) {
  try {
    assertOrigin(request);
    await requireAdmin();
    const { name } = categorySchema.parse(await readJson(request));
    const result = await (
      await getDb()
    )
      .collection("categories")
      .updateOne(
        { name },
        { $setOnInsert: { name, createdAt: new Date() } },
        { upsert: true },
      );
    if (!result.upsertedCount)
      throw new HttpError(409, "That category already exists.");
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request: Request) {
  try {
    assertOrigin(request);
    await requireAdmin();
    const input = await readJson(request);
    const currentName = categoryNameSchema.parse(input.currentName);
    const name = categoryNameSchema.parse(input.name);
    const db = await getDb();
    if (currentName === name) return Response.json({ ok: true });
    if (await db.collection("categories").findOne({ name }))
      throw new HttpError(409, "That category already exists.");
    const result = await db
      .collection("categories")
      .updateOne(
        { name: currentName },
        { $set: { name, updatedAt: new Date() } },
      );
    if (!result.matchedCount) throw new HttpError(404, "Category not found.");
    await db
      .collection("products")
      .updateMany({ category: currentName }, { $set: { category: name } });
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(request: Request) {
  try {
    assertOrigin(request);
    await requireAdmin();
    const name = categoryNameSchema.parse(
      new URL(request.url).searchParams.get("name"),
    );
    const db = await getDb();
    if (await db.collection("products").findOne({ category: name }))
      throw new HttpError(
        409,
        "Move or delete the products in this category before deleting it.",
      );
    const result = await db.collection("categories").deleteOne({ name });
    if (!result.deletedCount) throw new HttpError(404, "Category not found.");
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
