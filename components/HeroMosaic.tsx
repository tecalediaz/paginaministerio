import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

export function HomeUtilityBar() {
  return (
    <div className="section-shell flex items-end justify-center gap-1 py-3 sm:justify-end sm:py-4">
      <div className="flex items-end">
        <p className="social-seguinos">¡Seguinos!</p>
        <SocialLinks />
      </div>
    </div>
  );
}

const tileRadius = [
  "rounded-[2.6rem_0.2rem_2.6rem_0.2rem]",
  "rounded-[0.2rem_2.6rem_0.2rem_2.6rem]",
  "rounded-[2.2rem_2.2rem_0.2rem_2.2rem]",
  "rounded-[0.2rem_2.6rem_2.6rem_0.2rem]",
];

export function HeroMosaic() {
  const slides = site.home.slides;

  return (
    <section className="section-shell flex min-h-0 flex-1 flex-col pb-5 pt-1 sm:pb-6">
      <div className="grid min-h-0 flex-1 grid-cols-2 items-stretch gap-2.5 sm:grid-cols-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-3">
        <MosaicPhoto
          src={slides[0].src}
          alt={slides[0].alt}
          radius={tileRadius[0]}
          className="col-span-1 h-24 sm:h-32 lg:col-span-2 lg:h-auto"
          priority
        />
        <div
          className={`col-span-1 h-24 bg-brand-yellow sm:h-32 lg:col-span-2 lg:h-auto ${tileRadius[1]}`}
        />
        <MosaicPhoto
          src={slides[1].src}
          alt={slides[1].alt}
          radius={tileRadius[0]}
          className="col-span-1 h-24 sm:h-32 lg:col-span-2 lg:h-auto"
        />
        <div
          className={`hidden bg-brand-mint sm:block sm:h-32 lg:col-span-1 lg:h-auto ${tileRadius[1]}`}
        />

        <div className="col-span-2 flex flex-col justify-center gap-3 py-3 sm:col-span-4 lg:col-span-5 lg:row-span-2 lg:py-0 lg:pl-2">
          <h1 className="font-display text-[1.5rem] font-bold leading-[1.12] tracking-tight text-brand-ink sm:text-3xl lg:text-[2.05rem] xl:text-[2.35rem]">
            {site.home.headline}
          </h1>
          <div className="comic-brutal-button-container">
            <Link
              href={site.home.infanciasTile.href}
              className="comic-brutal-button"
            >
              <span className="button-inner">
                <span className="button-text">{site.home.infanciasTile.cta}</span>
                <span className="halftone-overlay" />
                <span className="ink-splatter" />
              </span>
              <span className="button-shadow" />
              <span className="button-frame" />
            </Link>
          </div>
        </div>

        <div
          className={`hidden bg-brand-mint lg:col-span-1 lg:block ${tileRadius[0]}`}
        />
        <MosaicPhoto
          src={slides[2].src}
          alt={slides[2].alt}
          radius={tileRadius[2]}
          className="col-span-2 h-28 sm:col-span-2 sm:h-32 lg:col-span-3 lg:h-auto"
        />
        <MosaicPhoto
          src={slides[3].src}
          alt={slides[3].alt}
          radius={tileRadius[2]}
          className="col-span-1 h-24 sm:h-32 lg:col-span-2 lg:h-auto"
        />
        <Link
          href={site.home.infanciasTile.href}
          className={`relative col-span-1 flex h-24 flex-col justify-end overflow-hidden bg-brand-navy p-3 text-white sm:h-32 lg:col-span-1 lg:h-auto ${tileRadius[0]}`}
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/70">
            {site.home.infanciasTile.label}
          </span>
          <span className="text-sm font-bold leading-tight sm:text-base">
            {site.home.infanciasTile.title}
          </span>
        </Link>
        <MosaicPhoto
          src={slides[4].src}
          alt={slides[4].alt}
          radius={tileRadius[3]}
          className="hidden sm:block sm:col-span-2 sm:h-32 lg:hidden"
        />
      </div>
    </section>
  );
}

function MosaicPhoto({
  src,
  alt,
  radius,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  radius: string;
  className: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${radius} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 50vw, 20vw"
        className="object-cover"
      />
    </div>
  );
}
