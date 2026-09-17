import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Maximize, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { calculateTotals, getNightlyRates } from "@/lib/pricing";
import { releaseExpiredHolds } from "@/lib/booking";
import { formatThb, nightsBetween } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { BookingSearchWidget } from "@/components/booking/BookingSearchWidget";

export const metadata: Metadata = {
  title: "Check Availability",
  description: "Search live availability and book your stay at Siam Tharadol Hotel directly.",
};

function todayIso(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ checkIn?: string; checkOut?: string; adults?: string; children?: string }>;
}) {
  await releaseExpiredHolds();

  const params = await searchParams;
  const checkIn = params.checkIn && /^\d{4}-\d{2}-\d{2}$/.test(params.checkIn) ? params.checkIn : todayIso(1);
  const checkOut = params.checkOut && /^\d{4}-\d{2}-\d{2}$/.test(params.checkOut) ? params.checkOut : todayIso(2);
  const adults = Math.max(1, Number(params.adults) || 2);
  const children = Math.max(0, Number(params.children) || 0);

  const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
  const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);
  const nights = nightsBetween(checkIn, checkOut);
  const validRange = checkOutDate > checkInDate;

  const rooms = validRange
    ? await prisma.room.findMany({
        where: { status: "ACTIVE" },
        orderBy: { sortOrder: "asc" },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      })
    : [];

  const results = [];
  if (validRange) {
    for (const room of rooms) {
      if (room.capacityAdults < adults || room.capacityAdults + room.capacityChildren < adults + children) continue;
      const nightlyRates = await getNightlyRates(room.id, checkInDate, checkOutDate);
      if (!nightlyRates || nightlyRates.some((n) => n.availableQty < 1)) continue;
      results.push({ room, totals: calculateTotals(nightlyRates, 1) });
    }
  }

  const searchQuery = new URLSearchParams({ checkIn, checkOut, adults: String(adults), children: String(children) }).toString();

  return (
    <div className="pt-28 pb-24 sm:pt-32">
      <Container>
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-deep">Book Direct</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Check Availability</h1>
          <p className="mt-3 text-sm text-ink-soft">
            {nights > 0 ? `${nights} night${nights > 1 ? "s" : ""} · ${adults} adult${adults > 1 ? "s" : ""}${children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}` : "Choose your dates below."}
          </p>
        </div>

        <div className="mt-8 max-w-3xl">
          <BookingSearchWidget variant="card" />
        </div>

        {!validRange && (
          <p className="mt-10 rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Check-out must be after check-in. Please adjust your dates above.
          </p>
        )}

        {validRange && results.length === 0 && (
          <p className="mt-10 rounded-sm border border-line bg-paper p-6 text-sm text-ink-soft">
            No rooms are available for these dates and party size. Try adjusting your dates or call us at
            (02) 331-3738.
          </p>
        )}

        <div className="mt-10 space-y-6">
          {results.map(({ room, totals }) => (
            <div
              key={room.id}
              className="flex flex-col gap-6 rounded-sm border border-line bg-paper p-5 shadow-soft sm:flex-row sm:p-6"
            >
              <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-sm sm:h-auto sm:w-64">
                {room.images[0] && (
                  <Image src={room.images[0].url} alt={room.name} fill sizes="256px" className="object-cover" />
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h2 className="font-display text-xl text-ink">
                      <Link href={`/rooms/${room.slug}`} className="hover:text-gold-deep">
                        {room.name}
                      </Link>
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{room.description}</p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-soft">
                      <span className="inline-flex items-center gap-1.5">
                        <Maximize size={13} /> {room.sizeSqm} m²
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <BedDouble size={13} /> {room.bedType}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={13} /> Up to {room.capacityAdults} adults
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 border-t border-line pt-4 sm:items-end sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft/70">
                        Total for {nights} night{nights > 1 ? "s" : ""}
                      </p>
                      <p className="font-display text-2xl text-ink">{formatThb(totals.totalThb)}</p>
                      <p className="text-xs text-ink-soft">incl. tax</p>
                    </div>
                    <Link
                      href={`/book/${room.slug}?${searchQuery}`}
                      className="w-full rounded-sm bg-gold px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-gold-deep sm:w-auto"
                    >
                      Select Room
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
