import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { BookingError, cancelBooking } from "@/lib/booking";
import { logError } from "@/lib/log";

const bodySchema = z.object({ email: z.string().trim().email() });

const attempts = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;

/**
 * Guest-facing self-service cancellation. Same email-must-match-the-booking check as
 * /manage — this route is what actually cancels. See src/lib/booking.ts#cancelBooking for the
 * refund-policy caveat (no automated refund processing yet).
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }
  recent.push(now);
  attempts.set(ip, recent);

  const { reference } = await params;
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { reference } });
  if (!booking || booking.guestEmail.toLowerCase() !== parsed.data.email.toLowerCase()) {
    return NextResponse.json({ error: "We couldn't find a booking matching that reference and email." }, { status: 404 });
  }

  try {
    const result = await cancelBooking(booking.id, "guest");
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof BookingError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    logError("api/bookings/[reference]/cancel", err);
    return NextResponse.json({ error: "Could not cancel booking." }, { status: 500 });
  }
}
