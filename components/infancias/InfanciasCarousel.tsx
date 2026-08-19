"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt: string;
};

type InfanciasCarouselProps = {
  slides: readonly Slide[];
};

const INTERVAL_MS = 5200;

export function InfanciasCarousel({ slides }: InfanciasCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const goTo = useCallback((next: number) => {
    const total = slides.length;
    const target = ((next % total) + total) % total;
    const root = scrollerRef.current;
    const slide = slideRefs.current[target];
    if (!root || !slide) return;
    const left = slide.offsetLeft - (root.clientWidth - slide.clientWidth) / 2;
    root.scrollTo({
      left: Math.max(0, left),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion, slides.length]);

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    const slide = slideRefs.current[0];
    if (!root || !slide) return;
    const left = slide.offsetLeft - (root.clientWidth - slide.clientWidth) / 2;
    root.scrollTo({ left: Math.max(0, left), behavior: "auto" });
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const update = () => {
      const center = root.scrollLeft + root.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      slideRefs.current.forEach((node, i) => {
        if (!node) return;
        const mid = node.offsetLeft + node.clientWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setIndex(best);
    };

    root.addEventListener("scroll", update, { passive: true });
    update();
    return () => root.removeEventListener("scroll", update);
  }, [slides.length]);

  useEffect(() => {
    if (paused || reduceMotion || slides.length < 2) return;

    const id = window.setInterval(() => {
      goTo(index + 1);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [goTo, index, paused, reduceMotion, slides.length]);

  return (
    <section
      className="fp-film relative overflow-x-clip bg-white py-8 sm:py-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={scrollerRef}
        className="fp-film-track"
        tabIndex={0}
        aria-roledescription="carrusel"
        aria-label="Fotos de la jornada"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(index + 1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(index - 1);
          }
        }}
      >
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            ref={(node) => {
              slideRefs.current[i] = node;
            }}
            className={`fp-film-slide ${i === index ? "is-active" : ""}`}
            aria-current={i === index}
            aria-label={slide.alt}
            onClick={() => goTo(i)}
          >
            <Image
              src={slide.src}
              alt=""
              width={1600}
              height={1067}
              className="fp-film-image"
              sizes="(max-width: 640px) 82vw, (max-width: 1024px) 48vw, 32vw"
              priority={i < 3}
            />
          </button>
        ))}
      </div>

      <div className="section-shell mt-6 flex justify-center">
        <div className="fp-film-dots" role="tablist" aria-label="Fotos de la jornada">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Ir a la foto ${i + 1}`}
              className={`fp-film-dot ${i === index ? "is-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
