import { verifyDesktopToken } from "@/lib/desktopAuth";

export function requireDesktopAuth(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing Authorization header");
  }

  const token = authHeader.slice(7);
  return verifyDesktopToken(token);
}
