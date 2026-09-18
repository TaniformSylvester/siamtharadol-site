import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const bodySchema = z.object({ email: z.string().trim().email() });

// Best-effort per-IP throttle against guessing reference+email combos. Booking references are
// already high-entropy (ST- + 8 chars from a 31-symbol alphabet), this is defense in depth,
// not the only barrier.
const attempts = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;

/**
 * Guest-facing "manage my booking" lookup — no account system exists, so the booking
 * reference + the email on file together stand in for authentication. Returns booking details
 * only on a match; never reveals whether a reference exists if the email doesn't match it.
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

  const booking = await prisma.booking.findUnique({
    where: { reference: reference.trim().toUpperCase() },
    include: { room: true },
  });
  if (!booking || booking.guestEmail.toLowerCase() !== parsed.data.email.toLowerCase()) {
    return NextResponse.json({ error: "We couldn't find a booking matching that reference and email." }, { status: 404 });
  }

  return NextResponse.json({
    reference: booking.reference,
    status: booking.status,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    roomName: booking.room.name,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    adults: booking.adults,
    children: booking.children,
    subtotalThb: booking.subtotalThb,
    taxThb: booking.taxThb,
    totalThb: booking.totalThb,
  });
}
