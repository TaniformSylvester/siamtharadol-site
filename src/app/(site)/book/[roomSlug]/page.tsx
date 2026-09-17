import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { calculateTotals, getNightlyRates } from "@/lib/pricing";
import { nightsBetween } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { GuestDetailsForm } from "@/components/booking/GuestDetailsForm";

export default async function BookRoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomSlug: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; adults?: string; children?: string }>;
}) {
  const { roomSlug } = await params;
  const sp = await searchParams;

  const room = await prisma.room.findUnique({ where: { slug: roomSlug, status: "ACTIVE" } });
  if (!room) notFound();

  const checkIn = sp.checkIn && /^\d{4}-\d{2}-\d{2}$/.test(sp.checkIn) ? sp.checkIn : null;
  const checkOut = sp.checkOut && /^\d{4}-\d{2}-\d{2}$/.test(sp.checkOut) ? sp.checkOut : null;
  const adults = Math.max(1, Number(sp.adults) || 2);
  const children = Math.max(0, Number(sp.children) || 0);

  if (!checkIn || !checkOut) notFound();

  const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
  const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);
  const nightlyRates = await getNightlyRates(room.id, checkInDate, checkOutDate);

  if (!nightlyRates || nightlyRates.some((n) => n.availableQty < 1)) {
    return (
      <div className="pt-32 pb-24">
        <Container>
          <p className="rounded-sm border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            This room is no longer available for the selected dates. Please go back and search again.
          </p>
        </Container>
      </div>
    );
  }

  const totals = calculateTotals(nightlyRates, 1);
  const nights = nightsBetween(checkIn, checkOut);

  return (
    <div className="pt-28 pb-24 sm:pt-32">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-deep">Review & Confirm</p>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{room.name}</h1>

        <div className="mt-10">
          <GuestDetailsForm
            roomId={room.id}
            roomName={room.name}
            checkIn={checkIn}
            checkOut={checkOut}
            adults={adults}
            children={children}
            nights={nights}
            subtotalThb={totals.subtotalThb}
            taxThb={totals.taxThb}
            totalThb={totals.totalThb}
          />
        </div>
      </Container>
    </div>
  );
}
