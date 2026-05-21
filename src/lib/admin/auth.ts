import { createHmac } from "crypto";

export const SESSION_COOKIE = "admin-session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function signSession(password: string): string {
  const secret = process.env.ADMIN_SECRET ?? "fallback-secret";
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function verifySession(token: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return token === signSession(password);
}
