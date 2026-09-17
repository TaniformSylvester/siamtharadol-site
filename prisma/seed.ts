import { PrismaClient } from "@prisma/client";
import { rooms } from "../src/content/rooms";
import { nightlyRateForDate } from "../src/lib/pricing";
import { AVAILABILITY_WINDOW_DAYS, DEFAULT_INVENTORY_PER_ROOM } from "../src/lib/rooms";

const prisma = new PrismaClient();

const ROOM_TYPE_MAP: Record<string, string> = {
  "premier-king": "PREMIER_KING",
  "premier-twin": "PREMIER_TWIN",
  "premier-connected": "PREMIER_CONNECTED",
  "two-bedroom-suite": "TWO_BEDROOM_SUITE",
};

async function main() {
  console.log("Seeding rooms...");

  for (const [index, room] of rooms.entries()) {
    // The Room row is now edited live via /admin/rooms — this file only provides the INITIAL
    // data for a fresh database. `update: {}` intentionally no-ops on a room that already
    // exists, so re-running the seed never clobbers an admin edit.
    const dbRoom = await prisma.room.upsert({
      where: { slug: room.slug },
      update: {},
      create: {
        slug: room.slug,
        roomType: ROOM_TYPE_MAP[room.slug] ?? room.slug,
        name: room.name,
        shortDescription: room.shortDescription,
        description: room.description,
        capacityAdults: room.maxAdults,
        capacityChildren: room.maxChildren,
        bedType: room.bedType,
        sizeSqm: room.sizeSqm,
        basePriceThb: room.basePriceThb,
        isPlaceholder: room.isPlaceholder,
        features: JSON.stringify(room.features),
        sortOrder: index,
      },
    });

    const existingImages = await prisma.roomImage.count({ where: { roomId: dbRoom.id } });
    if (existingImages === 0) {
      await prisma.roomImage.createMany({
        data: room.gallery.map((img, i) => ({
          roomId: dbRoom.id,
          url: img.src,
          alt: img.alt,
          sortOrder: i,
        })),
      });
    }

    console.log(`  seeding availability for ${room.name} (${AVAILABILITY_WINDOW_DAYS} days)...`);
    // UTC midnight, to match how the booking/pricing code constructs and looks up dates
    // (see src/lib/pricing.ts, src/lib/booking.ts) — mixing local and UTC midnight here would
    // make Availability rows fail to match on non-UTC machines.
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < AVAILABILITY_WINDOW_DAYS; i++) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() + i);
      // dbRoom.basePriceThb (not the seed file's) so extending the window later uses whatever
      // rate is currently live, including any admin edit made via /admin/rooms.
      const priceThb = nightlyRateForDate(date, dbRoom.basePriceThb);

      await prisma.availability.upsert({
        where: { roomId_date: { roomId: dbRoom.id, date } },
        // Never overwrite an existing date's price/qty here — the admin room-edit endpoint
        // (src/app/api/admin/rooms/[id]/route.ts) is what pushes a new rate onto future
        // availability rows when basePriceThb changes. Reseeding only fills in gaps.
        update: {},
        create: {
          roomId: dbRoom.id,
          date,
          availableQty: DEFAULT_INVENTORY_PER_ROOM,
          priceThb,
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
