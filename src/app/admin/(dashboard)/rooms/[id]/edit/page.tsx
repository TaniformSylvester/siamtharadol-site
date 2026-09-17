import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseFeatures } from "@/lib/rooms";
import { RoomEditForm } from "@/components/admin/RoomEditForm";

export default async function AdminRoomEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const room = await prisma.room.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!room) notFound();

  const bookingCount = await prisma.booking.count({ where: { roomId: id } });

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/rooms" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft hover:text-ink">
        <ArrowLeft size={14} /> All Rooms
      </Link>

      <h1 className="mt-4 font-display text-2xl text-ink">Edit {room.name}</h1>

      <div className="mt-8">
        <RoomEditForm
          room={{
            id: room.id,
            name: room.name,
            shortDescription: room.shortDescription,
            description: room.description,
            bedType: room.bedType,
            sizeSqm: room.sizeSqm,
            capacityAdults: room.capacityAdults,
            capacityChildren: room.capacityChildren,
            basePriceThb: room.basePriceThb,
            isPlaceholder: room.isPlaceholder,
            status: room.status,
            features: parseFeatures(room.features),
            images: room.images.map((img) => ({ url: img.url, alt: img.alt })),
          }}
          bookingCount={bookingCount}
        />
      </div>
    </div>
  );
}
