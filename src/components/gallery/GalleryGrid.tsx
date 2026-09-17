"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { galleryCategories, galleryImages, type GalleryCategory } from "@/content/gallery";

export function GalleryGrid() {
  const [active, setActive] = useState<GalleryCategory | "All">("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = active === "All" ? galleryImages : galleryImages.filter((img) => img.category === active);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, filtered.length]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {galleryCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition",
              active === cat ? "border-gold bg-gold text-white" : "border-line text-ink-soft hover:border-gold/50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
        {filtered.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setLightboxIndex(i)}
            className="group relative block w-full overflow-hidden rounded-sm break-inside-avoid"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={i % 3 === 0 ? 1000 : 600}
              sizes="(min-width: 640px) 33vw, 50vw"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true">
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
            className="absolute right-5 top-5 text-white/80 hover:text-white"
          >
            <X size={28} />
          </button>
          <button
            onClick={() => setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))}
            aria-label="Previous image"
            className="absolute left-3 text-white/70 hover:text-white sm:left-6"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="relative max-h-[85vh] w-full max-w-4xl">
            <Image
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              width={1600}
              height={1200}
              className="max-h-[85vh] w-full rounded-sm object-contain"
            />
            <p className="mt-3 text-center text-sm text-white/70">{filtered[lightboxIndex].alt}</p>
          </div>

          <button
            onClick={() => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length))}
            aria-label="Next image"
            className="absolute right-3 text-white/70 hover:text-white sm:right-6"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
