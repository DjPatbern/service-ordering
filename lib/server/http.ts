import "server-only";
import { createHash } from "node:crypto";
import { ZodError } from "zod";
import { getDb } from "./db";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function assertOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = new URL(request.url).origin;
  if (!origin || origin !== expected)
    throw new HttpError(
      403,
      "Please submit this request from the store website.",
    );
}
export const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export async function rateLimit(
  request: Request,
  scope: string,
  max: number,
  minutes = 15,
) {
  const ip =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const bucket = Math.floor(Date.now() / (minutes * 60000));
  const db = await getDb();
  const result = await db.collection("limits").findOneAndUpdate(
    { _id: hash(`${scope}:${ip}:${bucket}`) } as never,
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt: new Date((bucket + 2) * minutes * 60000) },
    },
    { upsert: true, returnDocument: "after" },
  );
  if ((result?.count || 0) > max)
    throw new HttpError(429, "Too many attempts. Please try again later.");
}
export async function readJson(request: Request) {
  const text = await request.text();
  if (text.length > 24000) throw new HttpError(413, "Request is too large.");
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, "Invalid request.");
  }
}
export function failure(error: unknown) {
  if (error instanceof HttpError)
    return Response.json({ error: error.message }, { status: error.status });
  if (error instanceof ZodError)
    return Response.json(
      { error: error.issues[0]?.message || "Check your details." },
      { status: 400 },
    );
  // Do not expose connection strings, driver errors or database details to browsers.
  return Response.json(
    {
      error:
        "We couldn’t complete this request. Please try again or contact Zhoppin.",
    },
    { status: 503 },
  );
}
