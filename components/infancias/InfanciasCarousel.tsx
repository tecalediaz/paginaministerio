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
const EDGE_PX = 2;

function edgeSlack(maxScroll: number) {
  return Math.max(12, maxScroll * 0.02);
}

function wrapIndex(next: number, total: number) {
  return ((next % total) + total) % total;
}

function scrollLeftFor(root: HTMLDivElement, slide: HTMLElement) {
  const raw = slide.offsetLeft - (root.clientWidth - slide.clientWidth) / 2;
  return Math.max(0, Math.min(raw, root.scrollWidth - root.clientWidth));
}

function indexFromScroll(root: HTMLDivElement, slides: number) {
  const maxScroll = root.scrollWidth - root.clientWidth;
  const sl = root.scrollLeft;
  const edge = edgeSlack(maxScroll);
  if (maxScroll <= edge || sl <= edge) return 0;
  if (sl >= maxScroll - edge) return slides - 1;

  const center = sl + root.clientWidth / 2;
  let best = 0;
  let bestDist = Infinity;
  const nodes = root.querySelectorAll<HTMLElement>(".fp-film-slide");
  nodes.forEach((node, i) => {
    const mid = node.offsetLeft + node.clientWidth / 2;
    const dist = Math.abs(mid - center);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}

export function InfanciasCarousel({ slides }: InfanciasCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const programmatic = useRef(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      const total = slides.length;
      const root = scrollerRef.current;
      if (!root || total < 1) return;

      let target = wrapIndex(next, total);
      let slide = slideRefs.current[target];
      if (!slide) return;

      const from = root.scrollLeft;
      let left = scrollLeftFor(root, slide);
      const dir = next >= index ? 1 : -1;

      if (Math.abs(left - from) < EDGE_PX && target !== 0 && target !== total - 1) {
        for (let step = 1; step < total; step++) {
          const candidate = wrapIndex(target + dir * step, total);
          const node = slideRefs.current[candidate];
          if (!node) continue;
          const candLeft = scrollLeftFor(root, node);
          if (
            Math.abs(candLeft - from) >= EDGE_PX ||
            candidate === 0 ||
            candidate === total - 1
          ) {
            target = candidate;
            slide = node;
            left = candLeft;
            break;
          }
        }
      }

      setIndex(target);
      if (Math.abs(left - from) < EDGE_PX) return;

      programmatic.current = true;
      root.scrollTo({
        left,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [index, reduceMotion, slides.length],
  );

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const update = () => {
      if (programmatic.current) return;
      setIndex(indexFromScroll(root, slides.length));
    };

    const unlock = () => {
      programmatic.current = false;
      setIndex(indexFromScroll(root, slides.length));
    };

    root.addEventListener("scroll", update, { passive: true });
    root.addEventListener("scrollend", unlock);
    const ro = new ResizeObserver(update);
    ro.observe(root);
    update();
    return () => {
      root.removeEventListener("scroll", update);
      root.removeEventListener("scrollend", unlock);
      ro.disconnect();
    };
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
