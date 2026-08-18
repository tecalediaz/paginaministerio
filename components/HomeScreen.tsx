import { InfanciasTeaser } from "@/components/InfanciasTeaser";
import { PhotoSlider } from "@/components/PhotoSlider";
import { site } from "@/content/site";

export function HomeScreen() {
  return (
    <section
      data-home-screen
      className="relative h-[100svh] max-h-[100svh] overflow-hidden bg-fg"
    >
      <PhotoSlider slides={site.home.slides} />

      <div className="section-shell relative z-10 flex h-full flex-col items-start justify-end pb-10 pt-24 sm:pb-20 sm:pt-32">
        <div className="mr-auto grid w-full max-w-[18.75rem] gap-2.5 animate-hero-rise sm:max-w-xl sm:gap-4">
          <InfanciasTeaser />

          <div className="rounded-sm border border-white/25 bg-white/12 p-3.5 text-fg-on-dark backdrop-blur-md sm:p-7">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/90 sm:text-[0.7rem] sm:tracking-[0.22em]">
              {site.home.card.eyebrow}
            </p>
            <h1 className="mt-2 font-display text-[1.15rem] font-semibold leading-[1.15] tracking-tight text-white sm:mt-3 sm:text-[clamp(1.35rem,3.2vw,1.95rem)]">
              {site.fullName}
            </h1>
            <p className="mt-1.5 font-display text-xs font-medium tracking-wide text-white/75 sm:mt-2 sm:text-base">
              {site.province}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
