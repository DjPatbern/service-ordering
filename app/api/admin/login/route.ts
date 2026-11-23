import { z } from "zod";
import {
  assertOrigin,
  failure,
  readJson,
  rateLimit,
  HttpError,
} from "@/lib/server/http";
import { verifyPassword, createSession } from "@/lib/server/auth";
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    await rateLimit(request, "login", 8);
    const input = z
      .object({
        email: z.email().max(200),
        password: z.string().min(1).max(256),
      })
      .parse(await readJson(request));
    const correctPassword = verifyPassword(input.password);
    if (
      !correctPassword ||
      input.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()
    )
      throw new HttpError(401, "Email or password is incorrect.");
    await createSession();
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
