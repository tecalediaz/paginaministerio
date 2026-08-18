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

function useSkipCanvas() {
  const [skip, setSkip] = useState(true);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-height: 600px)");
    const update = () => setSkip(motion.matches || compact.matches);
    update();
    motion.addEventListener("change", update);
    compact.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      compact.removeEventListener("change", update);
    };
  }, []);

  return skip;
}

export function FestiLanyardSlot() {
  const skip = useSkipCanvas();

  if (skip) return <StaticPass />;

  return (
    <LanyardErrorBoundary fallback={<StaticPass />}>
      <div className="home-launch__lanyard">
        <Suspense fallback={<StaticPass />}>
          <FestiLanyard />
        </Suspense>
      </div>
    </LanyardErrorBoundary>
  );
}
