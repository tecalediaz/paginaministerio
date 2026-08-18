import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { InfanciasHero } from "@/components/infancias/InfanciasHero";
import {
  IconBook,
  IconBulb,
  IconPin,
  IconShield,
  ProgramIcon,
} from "@/components/infancias/ProgramIcon";
import { infancias } from "@/content/infancias";

export function FestipequesLanding() {
  return (
    <div data-festipeques>
      <InfanciasHero />

      <section className="bg-[#f0f0f0] py-7 sm:py-9">
        <p className="section-shell text-center font-display text-[clamp(1.15rem,3.4vw,2.35rem)] font-black uppercase tracking-[-0.03em] text-fp-navy">
          {infancias.campaign.slogan.map((word, index) => {
            const isAccent = word === infancias.campaign.sloganAccent;
            const isLast = index === infancias.campaign.slogan.length - 1;
            return (
              <span key={word}>
                <span className={isAccent ? "text-fp-rosa" : undefined}>{word}</span>
                {isLast ? null : (
                  <span className="mx-1.5 font-semibold text-fp-navy/35 sm:mx-2.5">
                    ·
                  </span>
                )}
              </span>
            );
          })}
        </p>
      </section>

      <section className="fp-diamonds relative overflow-hidden bg-white py-16 sm:py-20">
        <Image
          src="/festipeques/nerdy.webp"
          alt=""
          width={280}
          height={380}
          className="pointer-events-none absolute -right-8 bottom-0 hidden h-48 w-auto opacity-90 sm:block lg:h-64"
        />
        <div className="section-shell relative">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fp-violeta">
              El Programa F.E.S. en números
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-fp-navy sm:text-4xl">
              Relevamiento — junio 2026
            </h2>
            <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {infancias.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-sm bg-[#f3f4f6] px-5 py-6"
                >
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 font-display text-4xl font-black tracking-tight text-fp-navy">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-bg py-16 sm:py-20">
        <div className="section-shell grid items-start gap-10 lg:grid-cols-[1fr_16rem]">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fp-celeste">
              {infancias.program.name}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-fp-navy sm:text-4xl">
              ¿Qué es el Programa F.E.S.?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg">
              {infancias.program.what}
            </p>

            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-3">
                  <ProgramIcon>
                    <IconBulb />
                  </ProgramIcon>
                  <h3 className="font-display text-xl font-bold text-fp-navy">
                    Misión
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  {infancias.program.mission}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <ProgramIcon>
                    <IconBook />
                  </ProgramIcon>
                  <h3 className="font-display text-xl font-bold text-fp-navy">
                    Visión
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  {infancias.program.vision}
                </p>
              </div>
            </div>
          </Reveal>
          <Image
            src="/festipeques/cosmo.webp"
            alt=""
            width={260}
            height={420}
            className="mx-auto hidden h-auto w-52 lg:block"
          />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="section-shell">
          <Reveal>
            <div className="flex items-start gap-3">
              <ProgramIcon>
                <IconShield />
              </ProgramIcon>
              <div>
                <h2 className="font-display text-2xl font-bold text-fp-navy sm:text-3xl">
                  {infancias.constitutional.title}
                </h2>
                <div className="mt-5 max-w-3xl border-l-4 border-fp-navy bg-[#f3f4f6] px-5 py-4">
                  <p className="text-sm leading-relaxed text-fg">
                    {infancias.constitutional.body}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line bg-bg-soft/70 py-16 sm:py-20">
        <Image
          src="/festipeques/neurito.webp"
          alt=""
          width={240}
          height={360}
          className="pointer-events-none absolute -bottom-6 -left-4 hidden h-44 w-auto sm:block"
        />
        <div className="section-shell relative">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fp-violeta">
              En el marco de las infancias
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-fp-navy sm:text-4xl">
              Actividades destacadas
            </h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2">
              {infancias.activities.map((item) => (
                <li key={item.id} className="border-t border-line pt-5">
                  <h3 className="font-display text-xl font-semibold text-fp-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="section-shell">
          <Reveal>
            <div className="flex items-center gap-3">
              <ProgramIcon>
                <IconPin />
              </ProgramIcon>
              <h2 className="font-display text-3xl font-bold tracking-tight text-fp-navy sm:text-4xl">
                Un compromiso en cada territorio
              </h2>
            </div>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg">
              {infancias.territory.lead}
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[infancias.territory.capital, infancias.territory.interior].map(
                (region) => (
                  <article
                    key={region.label}
                    className="relative overflow-hidden rounded-sm border border-line bg-[#f8f8f8] p-6"
                  >
                    <Image
                      src="/festipeques/pin.webp"
                      alt=""
                      width={56}
                      height={90}
                      className="absolute right-4 top-4 h-14 w-auto"
                    />
                    <h3 className="font-display text-2xl font-black text-fp-navy">
                      {region.label}
                    </h3>
                    <dl className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between gap-4 pr-16">
                        <dt className="text-fg-muted">Centros activos</dt>
                        <dd className="font-display font-bold text-fp-navy">
                          {region.centers}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 pr-16">
                        <dt className="text-fg-muted">Estudiantes</dt>
                        <dd className="font-display font-bold text-fp-navy">
                          {region.students}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 pr-16">
                        <dt className="text-fg-muted">Cobertura</dt>
                        <dd className="font-display font-bold text-fp-navy">
                          {region.coverage}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ),
              )}
            </div>

            <ul className="mt-10 max-w-3xl space-y-3 text-sm leading-relaxed text-fg">
              {infancias.territory.notes.map((note) => (
                <li key={note} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-fp-navy"
                  />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#fff6d6] py-14 sm:py-16">
        <Image
          src="/festipeques/arcanis.webp"
          alt=""
          width={220}
          height={360}
          className="pointer-events-none absolute -bottom-4 right-2 hidden h-40 w-auto sm:block"
        />
        <div className="section-shell relative grid gap-8 lg:grid-cols-[1.4fr_auto] lg:items-center">
          <blockquote>
            <p className="font-display text-2xl font-semibold leading-snug tracking-tight text-[#7a5a12] sm:text-3xl">
              “{infancias.quote}”
            </p>
            <footer className="mt-4 text-xs leading-relaxed text-fg-muted">
              {infancias.source}
            </footer>
          </blockquote>
          <Link href="/" className="btn-primary w-fit">
            Ir al inicio
          </Link>
        </div>
      </section>
    </div>
  );
}
