import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "st_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is not set");
  return s;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export async function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHashB64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (!adminEmail || !adminHashB64) return false;
  if (email.toLowerCase() !== adminEmail.toLowerCase()) return false;
  const adminHash = Buffer.from(adminHashB64, "base64").toString("utf8");
  return bcrypt.compare(password, adminHash);
}

export async function createAdminSession(email: string) {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${email}.${expires}`;
  const signature = sign(payload);
  const token = Buffer.from(`${payload}.${signature}`).toString("base64url");

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expires),
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastDot = decoded.lastIndexOf(".");
    const payload = decoded.slice(0, lastDot);
    const signature = decoded.slice(lastDot + 1);
    const expected = sign(payload);

    if (signature.length !== expected.length) return null;
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

    const splitAt = payload.lastIndexOf(".");
    const email = payload.slice(0, splitAt);
    const expiresStr = payload.slice(splitAt + 1);
    if (Date.now() > Number(expiresStr)) return null;

    return { email };
  } catch {
    return null;
  }
}
