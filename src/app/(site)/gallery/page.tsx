import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A photographic look at the rooms, pool, dining, and hotel spaces at Siam Tharadol Hotel.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Our Inside Pictures"
        description="Take a closer look at the rooms, pool, and dining spaces captured in and around Siam Tharadol."
        image="/media/rooms/room-balcony.jpg"
      />
      <section className="py-20 sm:py-28">
        <Container>
          <GalleryGrid />
        </Container>
      </section>
    </>
  );
}
