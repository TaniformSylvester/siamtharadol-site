import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { BookingError, createBookingHold } from "@/lib/booking";
import { logError } from "@/lib/log";

const bodySchema = z.object({
  roomId: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.coerce.number().int().min(1).max(20),
  children: z.coerce.number().int().min(0).max(10),
  guestName: z.string().trim().min(2).max(200),
  guestEmail: z.string().trim().email(),
  guestPhone: z.string().trim().min(6).max(40),
  specialRequests: z.string().trim().max(1000).optional(),
});

// Every field here is untrusted client input. Price is never accepted from the client —
// createBookingHold recomputes it server-side from Availability rows.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking details.", issues: parsed.error.issues }, { status: 400 });
  }

  const input = parsed.data;
  const room = await prisma.room.findUnique({ where: { id: input.roomId, status: "ACTIVE" } });
  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }
  if (input.adults > room.capacityAdults || input.adults + input.children > room.capacityAdults + room.capacityChildren) {
    return NextResponse.json({ error: "Guest count exceeds room capacity." }, { status: 400 });
  }

  try {
    const booking = await createBookingHold({
      roomId: input.roomId,
      checkIn: new Date(`${input.checkIn}T00:00:00.000Z`),
      checkOut: new Date(`${input.checkOut}T00:00:00.000Z`),
      adults: input.adults,
      children: input.children,
      roomQuantity: 1,
      guestName: input.guestName,
      guestEmail: input.guestEmail,
      guestPhone: input.guestPhone,
      specialRequests: input.specialRequests,
    });

    return NextResponse.json({ reference: booking.reference, totalThb: booking.totalThb, expiresAt: booking.expiresAt });
  } catch (err) {
    if (err instanceof BookingError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    logError("api/bookings", err);
    return NextResponse.json({ error: "Could not create booking. Please try again." }, { status: 500 });
  }
}
