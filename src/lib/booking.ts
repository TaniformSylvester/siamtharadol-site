import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { calculateTotals, getNightlyRates } from "@/lib/pricing";
import { sendBookingCancelledEmail } from "@/lib/email";

const HOLD_MINUTES = 15;

export function generateBookingReference() {
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `ST-${random}`;
}

export type CreateBookingInput = {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  roomQuantity: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
};

export class BookingError extends Error {}

/**
 * Places a temporary hold on inventory and creates a PENDING_PAYMENT booking, all inside
 * one transaction. Price is always recomputed here from Availability rows — never trust a
 * total the client sends. Nothing marks a booking PAID here; only the payment webhook does.
 */
export async function createBookingHold(input: CreateBookingInput) {
  return prisma.$transaction(async (tx) => {
    const nights: Date[] = [];
    for (let d = new Date(input.checkIn); d < input.checkOut; d.setUTCDate(d.getUTCDate() + 1)) {
      nights.push(new Date(d));
    }
    if (nights.length === 0) {
      throw new BookingError("Check-out must be after check-in.");
    }

    const availabilityRows = await tx.availability.findMany({
      where: { roomId: input.roomId, date: { gte: nights[0], lt: input.checkOut } },
    });
    const byDate = new Map(availabilityRows.map((r) => [r.date.toISOString().slice(0, 10), r]));

    for (const night of nights) {
      const row = byDate.get(night.toISOString().slice(0, 10));
      if (!row || row.availableQty < input.roomQuantity) {
        throw new BookingError("Selected room is no longer available for the chosen dates.");
      }
    }

    const nightlyRates = await getNightlyRates(input.roomId, input.checkIn, input.checkOut);
    if (!nightlyRates) {
      throw new BookingError("Selected room is no longer available for the chosen dates.");
    }
    const { subtotalThb, taxThb, totalThb } = calculateTotals(nightlyRates, input.roomQuantity);

    for (const night of nights) {
      await tx.availability.update({
        where: { roomId_date: { roomId: input.roomId, date: night } },
        data: { availableQty: { decrement: input.roomQuantity } },
      });
    }

    const booking = await tx.booking.create({
      data: {
        reference: generateBookingReference(),
        guestName: input.guestName,
        guestEmail: input.guestEmail,
        guestPhone: input.guestPhone,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        adults: input.adults,
        children: input.children,
        roomId: input.roomId,
        roomQuantity: input.roomQuantity,
        subtotalThb,
        taxThb,
        totalThb,
        status: "PENDING_PAYMENT",
        specialRequests: input.specialRequests,
        expiresAt: new Date(Date.now() + HOLD_MINUTES * 60 * 1000),
      },
    });

    return booking;
  });
}

/** Returns held inventory for a booking back to Availability. Call inside a transaction. */
export async function releaseBookingInventory(
  tx: Prisma.TransactionClient,
  booking: { id: string; roomId: string; checkIn: Date; checkOut: Date; roomQuantity: number }
) {
  const nights: Date[] = [];
  for (let d = new Date(booking.checkIn); d < booking.checkOut; d.setUTCDate(d.getUTCDate() + 1)) {
    nights.push(new Date(d));
  }
  for (const night of nights) {
    await tx.availability.updateMany({
      where: { roomId: booking.roomId, date: night },
      data: { availableQty: { increment: booking.roomQuantity } },
    });
  }
}

const CANCELLABLE_STATUSES = new Set(["PENDING_PAYMENT", "PAID"]);

/**
 * Cancels a booking — used by both the admin "cancel on a guest's behalf" action and the
 * guest-facing self-service cancellation. Releases inventory, marks the booking CANCELLED, and
 * emails the guest. Never touches Payment rows or processes a refund: the hotel has not
 * published a cancellation/refund policy (see CONTENT-NEEDED.md), so refund *eligibility* is a
 * manual staff decision for now — this only stops the room being held. Once a real policy
 * exists, that's the one place to add eligibility logic (e.g. by comparing `booking.checkIn` to
 * now) before calling this.
 */
export async function cancelBooking(bookingId: string, cancelledBy: "admin" | "guest") {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { room: true } });
  if (!booking) throw new BookingError("Booking not found.");
  if (!CANCELLABLE_STATUSES.has(booking.status)) {
    throw new BookingError(`Booking is already ${booking.status.toLowerCase().replace("_", " ")} — nothing to cancel.`);
  }

  await prisma.$transaction(async (tx) => {
    await releaseBookingInventory(tx, booking);
    await tx.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
  });

  const wasPaid = booking.status === "PAID";
  await sendBookingCancelledEmail({ booking, wasPaid, cancelledBy });

  return { wasPaid };
}

/** Releases inventory for any PENDING_PAYMENT booking whose hold has timed out. */
export async function releaseExpiredHolds() {
  const expired = await prisma.booking.findMany({
    where: { status: "PENDING_PAYMENT", expiresAt: { lt: new Date() } },
  });

  for (const booking of expired) {
    await prisma.$transaction(async (tx) => {
      await releaseBookingInventory(tx, booking);
      await tx.booking.update({ where: { id: booking.id }, data: { status: "EXPIRED" } });
    });
  }

  return expired.length;
}
