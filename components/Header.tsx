"use client";

import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-ink/8 bg-white">
      <div className="section-shell flex items-center justify-between gap-4 py-4 sm:gap-6 sm:py-5">
        <Link href="/" className="group min-w-0 shrink">
          <Image
            src="/ministerio.svg"
            alt={site.fullName}
            width={420}
            height={90}
            className="h-9 w-auto max-w-[min(100%,220px)] object-contain object-left transition-opacity duration-200 group-hover:opacity-80 sm:h-11 sm:max-w-[280px]"
            priority
          />
        </Link>

        <SocialLinks className="social-uiverse--header" />
      </div>
    </header>
  );
}
