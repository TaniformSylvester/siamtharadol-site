import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { seedAvailabilityForRoom, slugify, stringifyFeatures } from "@/lib/rooms";
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

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid room details.", issues: parsed.error.issues }, { status: 400 });
  }
  const input = parsed.data;

  const baseSlug = slugify(input.name) || "room";
  let slug = baseSlug;
  for (let i = 2; await prisma.room.findUnique({ where: { slug } }); i++) {
    slug = `${baseSlug}-${i}`;
  }

  try {
    const maxSortOrder = await prisma.room.aggregate({ _max: { sortOrder: true } });
    const room = await prisma.$transaction(async (tx) => {
      const created = await tx.room.create({
        data: {
          slug,
          roomType: slug.toUpperCase().replace(/-/g, "_"),
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
          sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1,
        },
      });

      if (input.images.length > 0) {
        await tx.roomImage.createMany({
          data: input.images.map((img, i) => ({ roomId: created.id, url: img.url, alt: img.alt, sortOrder: i })),
        });
      }

      return created;
    });

    await seedAvailabilityForRoom(room.id, room.basePriceThb);

    revalidatePath("/");
    revalidatePath("/rooms");
    revalidatePath("/book");
    revalidatePath("/admin/rooms");

    return NextResponse.json({ ok: true, id: room.id, slug: room.slug });
  } catch (err) {
    logError("api/admin/rooms POST", err);
    return NextResponse.json({ error: "Could not create room." }, { status: 500 });
  }
}
