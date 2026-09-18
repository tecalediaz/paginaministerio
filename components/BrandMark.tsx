import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { site } from "@/content/site";

export function BrandMark({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();

    if (window.location.pathname !== "/") return;
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <Link
      href="/"
      className="header-brand flex min-w-0 items-center gap-2 sm:gap-3"
      onClick={onClick}
      onNavigate={(event) => {
        if (window.location.pathname === "/") event.preventDefault();
      }}
    >
      <Image
        src="/logo-gob-rioja.svg"
        alt=""
        width={48}
        height={54}
        className={compact ? "h-9 w-auto" : "h-11 w-auto sm:h-12"}
        priority
      />
      <Image
        src="/ministerio.svg"
        alt={site.fullName}
        width={420}
        height={90}
        className={`w-auto object-contain object-left ${
          compact
            ? "h-7 max-w-[min(100%,148px)] sm:h-8 sm:max-w-[220px]"
            : "h-8 max-w-[min(100%,168px)] sm:h-10 sm:max-w-[280px]"
        }`}
        priority
      />
    </Link>
  );
}
