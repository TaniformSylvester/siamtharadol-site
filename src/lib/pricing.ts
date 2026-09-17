import { prisma } from "@/lib/db";

// VAT placeholder — Thailand's standard VAT rate. The hotel has not published its
// actual tax/service-charge policy (see CONTENT-NEEDED.md); confirm before going live.
const VAT_RATE = 0.07;

// Friday/Saturday night uplift applied on top of a room's base rate. Used both when seeding
// fresh Availability rows (prisma/seed.ts) and when an admin edit pushes a new base rate onto
// future dates (src/app/api/admin/rooms/[id]/route.ts) — kept in one place so they can't drift.
export const WEEKEND_MULTIPLIER = 1.15;

export function nightlyRateForDate(date: Date, basePriceThb: number): number {
  const isWeekend = date.getUTCDay() === 5 || date.getUTCDay() === 6;
  return isWeekend ? Math.round(basePriceThb * WEEKEND_MULTIPLIER) : basePriceThb;
}

export type NightlyRate = { date: string; priceThb: number; availableQty: number };

/**
 * Reads Availability rows for every night of the stay. Returns null if any night
 * is missing an Availability row (treated as "not bookable" rather than guessing a price).
 */
export async function getNightlyRates(roomId: string, checkIn: Date, checkOut: Date): Promise<NightlyRate[] | null> {
  const nights: Date[] = [];
  for (let d = new Date(checkIn); d < checkOut; d.setUTCDate(d.getUTCDate() + 1)) {
    nights.push(new Date(d));
  }
  if (nights.length === 0) return null;

  const rows = await prisma.availability.findMany({
    where: { roomId, date: { gte: nights[0], lt: checkOut } },
  });

  const byDate = new Map(rows.map((r) => [r.date.toISOString().slice(0, 10), r]));
  const result: NightlyRate[] = [];
  for (const night of nights) {
    const key = night.toISOString().slice(0, 10);
    const row = byDate.get(key);
    if (!row) return null;
    result.push({ date: key, priceThb: row.priceThb, availableQty: row.availableQty });
  }
  return result;
}

export function calculateTotals(nightlyRates: NightlyRate[], roomQuantity: number) {
  const subtotalThb = nightlyRates.reduce((sum, n) => sum + n.priceThb, 0) * roomQuantity;
  const taxThb = Math.round(subtotalThb * VAT_RATE);
  const totalThb = subtotalThb + taxThb;
  return { subtotalThb, taxThb, totalThb, vatRate: VAT_RATE };
}
