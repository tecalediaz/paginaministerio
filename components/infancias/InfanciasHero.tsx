import Image from "next/image";
import { infancias } from "@/content/infancias";

export function InfanciasHero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden text-white">
      <Image
        src="/festipeques/hero-parque.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden
        className="object-cover object-[center_40%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#1e2a4a]/90 via-[#1e2a4a]/70 to-[#1e2a4a]/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#1e2a4a]/80 via-transparent to-[#1e2a4a]/35"
      />
      <Image
        src="/festipeques/papelitos.webp"
        alt=""
        width={360}
        height={360}
        className="pointer-events-none absolute -top-8 right-0 w-40 opacity-80 sm:w-56"
      />

      <div className="section-shell relative z-10 grid min-h-[100svh] items-end gap-8 pb-10 pt-28 sm:items-center sm:pb-16 sm:pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="max-w-xl animate-hero-rise">
          <p className="font-banner text-sm uppercase tracking-wide text-fp-amarillo sm:text-base">
            {infancias.hero.eyebrow}
          </p>
          <Image
            src="/festipeques/logo.webp"
            alt="Festi Peques. Infancias cuidadas. La Rioja, Argentina."
            width={420}
            height={366}
            priority
            className="mt-3 h-auto w-[min(100%,18rem)] drop-shadow-lg sm:w-[min(100%,22rem)]"
          />
          <h1 className="mt-5 font-display text-[clamp(1.7rem,4.2vw,2.75rem)] font-black leading-[1.08] tracking-tight">
            {infancias.hero.title}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            {infancias.hero.subtitle}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-[0.95rem]">
            {infancias.intro}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-lg animate-hero-rise-delay lg:max-w-none">
          <Image
            src="/festipeques/grupal.webp"
            alt="Mascotas de Festi Peques: Cosmo, Nerdy, Neurito y Arcanis."
            width={1400}
            height={1045}
            priority
            className="h-auto w-full drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
