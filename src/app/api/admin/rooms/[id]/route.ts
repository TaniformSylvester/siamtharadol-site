import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { nightlyRateForDate } from "@/lib/pricing";
import { stringifyFeatures } from "@/lib/rooms";
import { logError } from "@/lib/log";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  shortDescription: z.string().trim().min(1).max(300),
  description: z.string().trim().min(1).max(4000),
  bedType: z.string().trim().min(1).max(120),
  sizeSqm: z.coerce.number().int().min(1).max(2000),
  capacityAdults: z.coerce.number().int().min(1).max(20),
  capacityChildren: z.coerce.number().int().min(0).max(20),
  basePriceThb: z.coerce.number().int().min(1).max(1_000_000),
  isPlaceholder: z.boolean(),
  status: z.enum(["ACTIVE", "HIDDEN"]),
  features: z.array(z.string().trim().min(1).max(120)).max(30),
  images: z.array(z.object({ url: z.string().trim().min(1).max(500), alt: z.string().trim().min(1).max(200) })).max(30),
});

// Admin-only — this route sits outside the /admin/(dashboard) layout that gates page renders,
// so it must check the session itself.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid room details.", issues: parsed.error.issues }, { status: 400 });
  }
  const input = parsed.data;

  const existing = await prisma.room.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.room.update({
        where: { id },
        data: {
          name: input.name,
          shortDescription: input.shortDescription,
          description: input.description,
          bedType: input.bedType,
          sizeSqm: input.sizeSqm,
          capacityAdults: input.capacityAdults,
          capacityChildren: input.capacityChildren,
          basePriceThb: input.basePriceThb,
          isPlaceholder: input.isPlaceholder,
          status: input.status,
          features: stringifyFeatures(input.features),
        },
      });

      await tx.roomImage.deleteMany({ where: { roomId: id } });
      if (input.images.length > 0) {
        await tx.roomImage.createMany({
          data: input.images.map((img, i) => ({ roomId: id, url: img.url, alt: img.alt, sortOrder: i })),
        });
      }

      // Price changed: push the new rate onto every not-yet-passed Availability row. Never
      // touches availableQty, and never rewrites a date that's already in the past.
      if (input.basePriceThb !== existing.basePriceThb) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const futureRows = await tx.availability.findMany({
          where: { roomId: id, date: { gte: today } },
          select: { id: true, date: true },
        });

        for (const row of futureRows) {
          await tx.availability.update({
            where: { id: row.id },
            data: { priceThb: nightlyRateForDate(row.date, input.basePriceThb) },
          });
        }
      }
    });
  } catch (err) {
    logError("api/admin/rooms/[id] PATCH", err);
    return NextResponse.json({ error: "Could not save changes." }, { status: 500 });
  }

  // The marketing pages read the DB on every request (no generateStaticParams for room
  // detail), but revalidate anyway in case a fetch cache or future ISR config is added.
  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${existing.slug}`);
  revalidatePath("/book");
  revalidatePath("/admin/rooms");

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.room.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  // Never let a delete silently destroy booking history. RoomImage/Availability cascade-delete
  // fine (they're disposable), but a room with any bookings — of any status, including old
  // cancelled/expired ones — must be hidden instead, not removed.
  const bookingCount = await prisma.booking.count({ where: { roomId: id } });
  if (bookingCount > 0) {
    return NextResponse.json(
      { error: `This room has ${bookingCount} booking${bookingCount > 1 ? "s" : ""} on record and can't be deleted. Set it to Hidden instead to remove it from the site.` },
      { status: 409 }
    );
  }

  try {
    await prisma.room.delete({ where: { id } });
  } catch (err) {
    logError("api/admin/rooms/[id] DELETE", err);
    return NextResponse.json({ error: "Could not delete room." }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${existing.slug}`);
  revalidatePath("/book");
  revalidatePath("/admin/rooms");

  return NextResponse.json({ ok: true });
}
