"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

const sloganTone = {
  educacion: "green",
  infancias: "blue",
  trabajo: "red",
  deporte: "yellow",
  discapacidad: "blue",
} as const satisfies Record<(typeof site.slogan)[number]["need"], string>;

export function SloganStrip() {
  const stripRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [interacting, setInteracting] = useState(false);
  const highlightedIndex = hoverIndex ?? focusIndex ?? activeIndex;

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    observer.observe(strip);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hoverIndex !== null || focusIndex !== null || interacting) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    function syncTimer() {
      clearInterval(timer);
      if (motion.matches) return;
      timer = setInterval(() => {
        if (visibleRef.current && document.visibilityState === "visible") {
          setActiveIndex((index) => (index + 1) % site.slogan.length);
        }
      }, 3200);
    }
    syncTimer();
    motion.addEventListener("change", syncTimer);
    return () => {
      clearInterval(timer);
      motion.removeEventListener("change", syncTimer);
    };
  }, [hoverIndex, focusIndex, interacting]);

  useEffect(() => {
    const strip = stripRef.current;
    const item = strip?.children[highlightedIndex] as HTMLElement | undefined;
    if (!strip || !item || strip.scrollWidth <= strip.clientWidth || interacting) return;
    const stripRect = strip.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    strip.scrollTo({
      left: strip.scrollLeft + itemRect.left - stripRect.left - (strip.clientWidth - itemRect.width) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [highlightedIndex, interacting]);

  return (
    <section className="border-b border-line">
      <div ref={stripRef} className="slogan-strip flex overflow-x-auto"
        onPointerLeave={() => setHoverIndex(null)}
        onPointerDown={(event) => { if (event.pointerType !== "mouse") setInteracting(true); }}
        onPointerUp={() => setInteracting(false)}
        onPointerCancel={() => setInteracting(false)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusIndex(null); }}>
        {site.slogan.map((item, index) => (
          <Link
            key={item.text}
            href={item.href}
            data-tone={sloganTone[item.need]}
            data-active={highlightedIndex === index}
            aria-label={item.text}
            title={item.text}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setHoverIndex(index); }}
            onFocus={() => setFocusIndex(index)}
            className="slogan-strip__item flex min-h-14 min-w-[44%] items-center justify-center border-r border-white/20 px-4 text-sm font-black tracking-[0.18em] lg:text-base"
          >
            <span className="slogan-strip__label">{item.text}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
