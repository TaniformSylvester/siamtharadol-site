import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getActiveRooms } from "@/lib/rooms";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RoomCard } from "@/components/rooms/RoomCard";

export async function RoomsShowcase() {
  const rooms = await getActiveRooms();

  return (
    <section className="bg-paper py-24 sm:py-32">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Accommodation"
            title="Rooms & Suites"
            description="Four room types, each finished in calm, contemporary Thai style with a deep soaking bathtub and considered detail throughout."
          />
          <Link
            href="/rooms"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep hover:text-gold"
          >
            View all rooms <ArrowUpRight size={14} />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room, i) => (
            <Reveal key={room.slug} delay={i * 90}>
              <RoomCard room={room} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
