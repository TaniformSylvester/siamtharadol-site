import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { calculateTotals, getNightlyRates } from "@/lib/pricing";
import { releaseExpiredHolds } from "@/lib/booking";

const querySchema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.coerce.number().int().min(1).max(20).default(2),
  children: z.coerce.number().int().min(0).max(10).default(0),
});

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid search parameters." }, { status: 400 });
  }

  await releaseExpiredHolds();

  const { checkIn, checkOut, adults, children } = parsed.data;
  const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
  const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);

  if (checkOutDate <= checkInDate) {
    return NextResponse.json({ error: "Check-out must be after check-in." }, { status: 400 });
  }

  const rooms = await prisma.room.findMany({
    where: { status: "ACTIVE" },
    orderBy: { sortOrder: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  const results = [];
  for (const room of rooms) {
    if (room.capacityAdults < adults || room.capacityAdults + room.capacityChildren < adults + children) {
      continue;
    }

    const nightlyRates = await getNightlyRates(room.id, checkInDate, checkOutDate);
    if (!nightlyRates || nightlyRates.some((n) => n.availableQty < 1)) continue;

    const totals = calculateTotals(nightlyRates, 1);
    results.push({
      roomId: room.id,
      slug: room.slug,
      name: room.name,
      bedType: room.bedType,
      sizeSqm: room.sizeSqm,
      capacityAdults: room.capacityAdults,
      capacityChildren: room.capacityChildren,
      image: room.images[0]?.url ?? null,
      nights: nightlyRates.length,
      ...totals,
    });
  }

  return NextResponse.json({ checkIn, checkOut, adults, children, rooms: results });
}
