import type { Metadata } from "next";
import { getActiveRooms } from "@/lib/rooms";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RoomCard } from "@/components/rooms/RoomCard";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description: "Four room types at Siam Tharadol Hotel, each finished in calm, contemporary Thai style with a deep soaking bathtub.",
};

export default async function RoomsPage() {
  const rooms = await getActiveRooms();

  return (
    <>
      <PageHero
        eyebrow="Accommodation"
        title="Rooms & Suites"
        description="Our spacious rooms are designed around the quality of their materials and finishing, in contemporary Thai architecture — relax in comfortable beds with a full range of in-room amenities."
        image="/media/rooms/premier-king-bedroom.jpg"
      />
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room, i) => (
              <Reveal key={room.slug} delay={i * 90}>
                <RoomCard room={room} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
