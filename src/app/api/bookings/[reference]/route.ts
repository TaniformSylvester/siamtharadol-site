import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;

  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { room: true, payments: { orderBy: { createdAt: "desc" } } },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({
    reference: booking.reference,
    status: booking.status,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    adults: booking.adults,
    children: booking.children,
    roomName: booking.room.name,
    subtotalThb: booking.subtotalThb,
    taxThb: booking.taxThb,
    totalThb: booking.totalThb,
    currency: booking.currency,
    expiresAt: booking.expiresAt,
    latestPaymentStatus: booking.payments[0]?.status ?? null,
  });
}
