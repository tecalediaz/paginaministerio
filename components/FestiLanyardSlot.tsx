"use client";

import { Component, Suspense, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const FestiLanyard = dynamic(() => import("@/components/FestiLanyard"), {
  ssr: false,
  loading: () => <StaticPass />,
});

function StaticPass() {
  return (
    <div className="home-launch__pass-static">
      <Image
        src="/festipeques/card-front.webp"
        alt="Pase Festi Peques, Infancias cuidadas"
        width={1080}
        height={1545}
        className="home-launch__pass-img"
        priority
      />
    </div>
  );
}

class LanyardErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function useCanvasMode() {
  const [mode, setMode] = useState<{ skip: boolean; fullBleed: boolean }>({
    skip: true,
    fullBleed: false,
  });

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-height: 600px)");
    const wide = window.matchMedia("(min-width: 1024px)");
    const update = () =>
      setMode({ skip: motion.matches || compact.matches, fullBleed: wide.matches });
    update();
    const queries = [motion, compact, wide];
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  return mode;
}

export function FestiLanyardSlot() {
  const { skip, fullBleed } = useCanvasMode();

  if (skip) return <StaticPass />;

  return (
    <LanyardErrorBoundary fallback={<StaticPass />}>
      <div
        className="home-launch__lanyard"
        data-full-bleed={fullBleed ? "" : undefined}
      >
        <Suspense fallback={<StaticPass />}>
          <FestiLanyard key={fullBleed ? "full" : "inline"} fullBleed={fullBleed} />
        </Suspense>
      </div>
    </LanyardErrorBoundary>
  );
}
