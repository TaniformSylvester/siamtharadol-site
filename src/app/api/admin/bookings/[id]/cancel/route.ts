import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { BookingError, cancelBooking } from "@/lib/booking";
import { logError } from "@/lib/log";

// Admin-only — for staff cancelling a booking on a guest's behalf (e.g. a phone call).
// See src/lib/booking.ts#cancelBooking for what this does and doesn't do (no refund processing).
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await cancelBooking(id, "admin");
    revalidatePath(`/admin/bookings/${id}`);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof BookingError) {
      return NextResponse.json({ error: err.message }, { status: err.message === "Booking not found." ? 404 : 409 });
    }
    logError("api/admin/bookings/[id]/cancel", err);
    return NextResponse.json({ error: "Could not cancel booking." }, { status: 500 });
  }
}
