import "server-only";
import { MongoClient, type Db } from "mongodb";
const globalDb = globalThis as typeof globalThis & {
  zhoppinClient?: Promise<MongoClient>;
  zhoppinIndexes?: Promise<void>;
};
export function databaseConfigured() {
  return Boolean(process.env.MONGODB_URI);
}
export async function getClient() {
  if (!process.env.MONGODB_URI)
    throw new Error(
      "Store connection is not configured. Please contact Zhoppin on WhatsApp.",
    );
  if (!globalDb.zhoppinClient)
    globalDb.zhoppinClient = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 7000,
    })
      .connect()
      .catch((error) => {
        globalDb.zhoppinClient = undefined;
        throw error;
      });
  return globalDb.zhoppinClient;
}
async function indexes(db: Db) {
  await Promise.all([
    db.collection("products").createIndex({ slug: 1 }, { unique: true }),
    db.collection("categories").createIndex({ name: 1 }, { unique: true }),
    db.collection("orders").createIndex({ tokenHash: 1 }, { unique: true }),
    db
      .collection("orders")
      .createIndex({ idempotencyHash: 1 }, { unique: true }),
    db.collection("orders").createIndex({ createdAt: -1 }),
    db
      .collection("sessions")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db
      .collection("limits")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
}
export async function getDb() {
  const db = (await getClient()).db(process.env.MONGODB_DB || "zhoppin");
  if (!globalDb.zhoppinIndexes)
    globalDb.zhoppinIndexes = indexes(db).catch((error) => {
      globalDb.zhoppinIndexes = undefined;
      throw error;
    });
  await globalDb.zhoppinIndexes;
  return db;
}
