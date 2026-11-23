import "server-only";
import { getDb, databaseConfigured } from "./db";
import { seedProducts } from "@/features/store/seed";
import {
  defaultCategories,
  productSchema,
  type Product,
} from "@/features/store/schema";
export async function getProducts(admin = false): Promise<Product[]> {
  if (!databaseConfigured()) return seedProducts;
  const db = await getDb();
  const rows = await db
    .collection("products")
    .find(admin ? {} : { published: true })
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();
  return rows.map((row) => productSchema.parse(row));
}
export async function getProduct(slug: string) {
  return (await getProducts()).find((product) => product.slug === slug);
}
export async function getCategories(): Promise<string[]> {
  if (!databaseConfigured()) return [...defaultCategories];
  const db = await getDb();
  await db.collection("categories").bulkWrite(
    defaultCategories.map((name) => ({
      updateOne: {
        filter: { name },
        update: { $setOnInsert: { name, createdAt: new Date() } },
        upsert: true,
      },
    })),
  );
  const rows = await db
    .collection("categories")
    .find({}, { projection: { name: 1 } })
    .sort({ name: 1 })
    .toArray();
  return rows.map((row) => String(row.name));
}
export async function getFeaturedProduct() {
  return (await getProducts()).find((product) => product.featured) || null;
}
export async function importSeedProducts() {
  const db = await getDb();
  await db.collection("products").bulkWrite(
    seedProducts.map((product) => ({
      updateOne: {
        filter: { slug: product.slug },
        update: { $setOnInsert: { ...product, createdAt: new Date() } },
        upsert: true,
      },
    })),
  );
}
