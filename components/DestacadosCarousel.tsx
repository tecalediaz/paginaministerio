"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const INTERVAL_MS = 5000;
const SLIDE_MS = 500;

function slideKey(slide: ReactNode, index: number) {
  if (isValidElement(slide) && slide.key != null) return String(slide.key);
  return `destacado-${index}`;
}

export function DestacadosCarousel({ children }: { children: ReactNode }) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const activeRef = useRef(0);
  const reduceRef = useRef(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduceRef.current = mq.matches;
      if (mq.matches) setOutgoing(null);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (count < 2 || paused) return;

    const id = window.setInterval(() => {
      const current = activeRef.current;
      const next = (current + 1) % count;
      if (!reduceRef.current) setOutgoing(current);
      activeRef.current = next;
      setActive(next);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [count, paused]);

  useEffect(() => {
    if (outgoing === null) return;
    const id = window.setTimeout(() => setOutgoing(null), SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [outgoing]);

  if (count === 0) return null;

  const shown = new Set<number>([active]);
  if (outgoing !== null && outgoing !== active) shown.add(outgoing);

  return (
    <div
      className="destacados-viewport mt-4 min-w-0 sm:mt-5"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setPaused(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setPaused(false);
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <ul className="min-w-0">
        {slides.map((slide, i) => {
          if (!shown.has(i)) return null;
          const entering = outgoing !== null && i === active;
          const leaving = i === outgoing;
          const motion = leaving ? "is-leave" : entering ? "is-enter" : "";
          return (
            <li
              key={slideKey(slide, i)}
              className={motion ? `destacados-slide ${motion}` : "destacados-slide"}
              aria-hidden={leaving ? true : undefined}
              inert={leaving ? true : undefined}
            >
              {slide}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
