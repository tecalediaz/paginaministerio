"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Slide = {
  src: string;
  alt: string;
};

type PhotoSliderProps = {
  slides: readonly Slide[];
  intervalMs?: number;
};

export function PhotoSlider({ slides, intervalMs = 5000 }: PhotoSliderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  if (slides.length === 0) return null;

  return (
    <div
      className="absolute inset-0"
      aria-roledescription="carrusel"
      aria-label="Galería de fotos"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[#3a3a3a]/60 via-[#3a3a3a]/30 to-[#3a3a3a]/35" />

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-8">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Ver foto ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-7 bg-white"
                : "w-1.5 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
