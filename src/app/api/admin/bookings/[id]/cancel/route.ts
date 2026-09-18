import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { releaseBookingInventory } from "@/lib/booking";
import { logError } from "@/lib/log";

const CANCELLABLE_STATUSES = new Set(["PENDING_PAYMENT", "PAID"]);

// Admin-only — for staff cancelling a booking on a guest's behalf (e.g. a phone call).
// Never touches Payment rows: if the booking was PAID, that payment record stays PAID as a
// historical fact — this only stops the room being held. Refunding, if needed, is a separate
// manual step via the 2C2P merchant dashboard once a real account exists.
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  if (!CANCELLABLE_STATUSES.has(booking.status)) {
    return NextResponse.json(
      { error: `Booking is already ${booking.status.toLowerCase().replace("_", " ")} — nothing to cancel.` },
      { status: 409 }
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      await releaseBookingInventory(tx, booking);
      await tx.booking.update({ where: { id }, data: { status: "CANCELLED" } });
    });
  } catch (err) {
    logError("api/admin/bookings/[id]/cancel", err);
    return NextResponse.json({ error: "Could not cancel booking." }, { status: 500 });
  }

  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, wasPaid: booking.status === "PAID" });
}
