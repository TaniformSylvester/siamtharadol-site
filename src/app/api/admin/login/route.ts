import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSession, verifyAdminCredentials } from "@/lib/auth";

const bodySchema = z.object({ email: z.string().email(), password: z.string().min(1) });

// Best-effort in-memory login throttle per IP, resets on restart — slows down brute force
// without needing extra infrastructure for a single small-property admin panel.
const attempts = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
  }
  recent.push(now);
  attempts.set(ip, recent);

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
  }

  const valid = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createAdminSession(parsed.data.email);
  return NextResponse.json({ ok: true });
}
