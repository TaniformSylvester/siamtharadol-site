"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDES = [
  { src: "/media/hero/exterior-facade-dusk.jpg", alt: "Siam Tharadol Hotel facade and pool courtyard at dusk" },
  { src: "/media/facilities/infinity-pool-night.jpg", alt: "Infinity-edge pool at night" },
  { src: "/media/facilities/lobby.jpg", alt: "Hotel lobby with chandelier and marble floor" },
  { src: "/media/rooms/premier-king-bedroom.jpg", alt: "Premier King bedroom" },
  { src: "/media/dining/restaurant-dining-room.jpg", alt: "HOM restaurant dining room" },
];

const INTERVAL_MS = 5500;

export function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn(
              "object-cover transition-opacity duration-[1500ms] ease-in-out",
              i === active ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-8">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === active}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-6 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </>
  );
}
