import { logout } from "@/lib/server/auth";
import { assertOrigin, failure } from "@/lib/server/http";
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    await logout();
    return Response.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
