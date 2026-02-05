import jwt from "jsonwebtoken";

const DESKTOP_JWT_SECRET = process.env.DESKTOP_JWT_SECRET;
const DESKTOP_JWT_EXPIRES_IN = "24h"; // keep short

if (!DESKTOP_JWT_SECRET) {
  throw new Error("DESKTOP_JWT_SECRET is not set");
}

export function signDesktopToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      scope: "desktop"
    },
    DESKTOP_JWT_SECRET,
    { expiresIn: DESKTOP_JWT_EXPIRES_IN }
  );
}

export function verifyDesktopToken(token) {
  const payload = jwt.verify(token, DESKTOP_JWT_SECRET);

  if (payload.scope !== "desktop") {
    throw new Error("Invalid token scope");
  }

  return payload;
}
