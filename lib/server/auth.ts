import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getDb } from "./db";
import { hash, HttpError } from "./http";
const cookieName = "zhoppin_admin";
function signingKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32)
    throw new HttpError(503, "Admin access has not been configured.");
  return new TextEncoder().encode(secret);
}
export function verifyPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH || "";
  const [salt, digest] = stored.split(":");
  if (
    !salt ||
    !digest ||
    !/^[a-f0-9]{128}$/.test(digest) ||
    password.length > 256
  )
    return false;
  return timingSafeEqual(
    scryptSync(password, salt, 64),
    Buffer.from(digest, "hex"),
  );
}
export async function createSession() {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 8 * 3600000);
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(process.env.ADMIN_EMAIL!)
    .setJti(id)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(signingKey());
  const db = await getDb();
  await db.collection("sessions").insertOne({ tokenHash: hash(id), expiresAt });
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 3600,
  });
}
export async function getAdmin() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, signingKey(), {
      algorithms: ["HS256"],
    });
    if (
      payload.role !== "admin" ||
      payload.sub !== process.env.ADMIN_EMAIL ||
      !payload.jti
    )
      return null;
    const db = await getDb();
    const session = await db.collection("sessions").findOne({
      tokenHash: hash(payload.jti),
      expiresAt: { $gt: new Date() },
    });
    return session ? { email: payload.sub, sessionId: payload.jti } : null;
  } catch {
    return null;
  }
}
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new HttpError(401, "Please sign in to continue.");
  return admin;
}
export async function logout() {
  const admin = await getAdmin();
  if (admin)
    await (
      await getDb()
    )
      .collection("sessions")
      .deleteOne({ tokenHash: hash(admin.sessionId) });
  (await cookies()).delete(cookieName);
}
