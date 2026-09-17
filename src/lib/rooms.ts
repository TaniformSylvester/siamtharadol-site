import { prisma } from "@/lib/db";
import { nightlyRateForDate } from "@/lib/pricing";

export const AVAILABILITY_WINDOW_DAYS = 365;
export const DEFAULT_INVENTORY_PER_ROOM = 4;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Creates 365 days of Availability rows for a brand-new room, starting today. */
export async function seedAvailabilityForRoom(roomId: string, basePriceThb: number, availableQty = DEFAULT_INVENTORY_PER_ROOM) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const rows = Array.from({ length: AVAILABILITY_WINDOW_DAYS }, (_, i) => {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() + i);
    return { roomId, date, availableQty, priceThb: nightlyRateForDate(date, basePriceThb) };
  });

  await prisma.availability.createMany({ data: rows });
}

export function parseFeatures(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((f) => typeof f === "string") : [];
  } catch {
    return [];
  }
}

export function stringifyFeatures(features: string[]): string {
  return JSON.stringify(features.map((f) => f.trim()).filter(Boolean));
}

/** Active rooms in display order, with images — the shape the public marketing pages use. */
export async function getActiveRooms() {
  return prisma.room.findMany({
    where: { status: "ACTIVE" },
    orderBy: { sortOrder: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getActiveRoomBySlug(slug: string) {
  return prisma.room.findUnique({
    where: { slug, status: "ACTIVE" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}

export type RoomWithImages = NonNullable<Awaited<ReturnType<typeof getActiveRoomBySlug>>>;
