"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { infancias } from "@/content/infancias";

export function InfanciasTeaser() {
  const [pressed, setPressed] = useState(false);

  return (
    <Link
      href={infancias.teaser.ctaHref}
      className={`infancias-teaser${pressed ? " is-pressed" : ""}`}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
    >
      <span className="infancias-teaser__face">
        <span aria-hidden className="infancias-teaser__bg" />
        <span className="infancias-teaser__content">
          <span className="infancias-teaser__title block">
            <span className="infancias-teaser__title-month">
              {infancias.campaign.tagline}
            </span>
            <span className="infancias-teaser__title-main">Festi Peques</span>
          </span>
          <span className="infancias-teaser__footer">
            <span className="infancias-teaser__cta">
              {infancias.teaser.ctaLabel}
            </span>
            <Image
              src="/festipeques/cosmo.webp"
              alt=""
              width={180}
              height={290}
              className="infancias-teaser__kids"
              aria-hidden
              priority
            />
          </span>
        </span>
      </span>
      <span aria-hidden className="infancias-teaser__bottom" />
      <span aria-hidden className="infancias-teaser__base" />
    </Link>
  );
}
