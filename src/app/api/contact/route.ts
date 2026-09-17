import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email(),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(5).max(4000),
  // Honeypot: real users never fill this in; bots filling every field usually do.
  company: z.string().max(0).optional().or(z.literal("")),
});

// Best-effort in-memory rate limit — resets on server restart, fine for a single-instance
// deploy. Swap for a shared store (Redis, etc.) behind a load balancer.
const submissions = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return NextResponse.json({ error: "Too many messages sent. Please try again later." }, { status: 429 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }
  if (parsed.data.company) {
    // Honeypot tripped — pretend success so bots don't learn anything, but do not process.
    return NextResponse.json({ ok: true });
  }

  recent.push(now);
  submissions.set(ip, recent);

  // No email/SMTP provider is configured yet (see README "What's left"). Logging server-side
  // for now so nothing is silently lost; wire up a transactional email provider before launch.
  console.log("[contact form]", { ...parsed.data, ip, at: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}
