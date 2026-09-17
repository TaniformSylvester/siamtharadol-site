import { Hero } from "@/components/home/Hero";
import { AwardsStrip } from "@/components/home/AwardsStrip";
import { Welcome } from "@/components/home/Welcome";
import { RoomsShowcase } from "@/components/home/RoomsShowcase";
import { WhyStay } from "@/components/home/WhyStay";
import { DiningTeaser } from "@/components/home/DiningTeaser";
import { ExperienceEditorial } from "@/components/home/ExperienceEditorial";
import { LocationTeaser } from "@/components/home/LocationTeaser";
import { Reviews } from "@/components/home/Reviews";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <AwardsStrip />
      <Welcome />
      <RoomsShowcase />
      <WhyStay />
      <DiningTeaser />
      <ExperienceEditorial />
      <LocationTeaser />
      <Reviews />
      <GalleryTeaser />
      <FinalCta />
    </>
  );
}
