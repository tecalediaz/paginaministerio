"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

const COMPACT_AFTER = 32;

export function Header() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const update = () => setCompact(window.scrollY > COMPACT_AFTER);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-compact={compact ? "" : undefined}
      className={`site-nav sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md ${
        compact
          ? "border-brand-ink/10 shadow-[0_6px_20px_rgba(30,42,74,0.07)]"
          : "border-brand-ink/8"
      }`}
    >
      <div
        className={`section-shell flex items-center justify-between gap-3 sm:gap-6 ${
          compact ? "py-2 sm:py-2.5" : "py-4 sm:py-5"
        }`}
      >
        <Link href="/" className="group min-w-0 shrink">
          <Image
            src="/ministerio.svg"
            alt={site.fullName}
            width={420}
            height={90}
            className={`w-auto object-contain object-left group-hover:opacity-80 ${
              compact
                ? "h-7 max-w-[min(100%,176px)] sm:h-8 sm:max-w-[220px]"
                : "h-9 max-w-[min(100%,220px)] sm:h-11 sm:max-w-[280px]"
            }`}
            priority
          />
        </Link>

        <SocialLinks
          className={`social-uiverse--header${compact ? " is-compact" : ""}`}
        />
      </div>
    </header>
  );
}
