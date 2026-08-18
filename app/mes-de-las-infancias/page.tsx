import type { Metadata } from "next";
import Link from "next/link";
import { ActivityMap } from "@/components/ActivityMap";
import { EventSchedule } from "@/components/EventSchedule";
import { Reveal } from "@/components/Reveal";
import { infancias } from "@/content/infancias";

export const metadata: Metadata = {
  title: "Agosto, Mes de las Infancias",
  description:
    "Agenda, mapas, horarios y puntos de encuentro del Mes de las Infancias en la Provincia de La Rioja. Contenido plantilla a reemplazar con información oficial.",
  openGraph: {
    title: "Agosto, Mes de las Infancias | La Rioja",
    description:
      "Actividades, jornadas y encuentros para niñas, niños y adolescentes en toda la provincia.",
  },
};

export default function MesDeLasInfanciasPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-bg-deep pt-10 text-fg-on-dark sm:pt-14">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(76,175,80,0.28),transparent_45%),linear-gradient(165deg,#3a3a3a_0%,#4a4a4a_55%,#333333_100%)]"
        />
        <div className="section-shell relative z-10 pb-16 sm:pb-20">
          <Link
            href="/"
            className="animate-hero-rise inline-flex text-sm font-medium text-fg-on-dark/75 transition-colors hover:text-accent"
          >
            ← Volver al inicio
          </Link>
          <p className="animate-hero-rise mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Programación especial
          </p>
          <h1 className="animate-hero-rise-delay mt-4 max-w-3xl font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[1.05] tracking-tight">
            {infancias.title}
          </h1>
          <p className="animate-hero-rise-delay-2 mt-6 max-w-2xl text-base leading-relaxed text-fg-on-dark/85 sm:text-lg">
            {infancias.intro}
          </p>
        </div>
      </section>

      <section className="bg-bg py-16 sm:py-20">
        <div className="section-shell">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              En números
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              Datos de la campaña
            </h2>
            <p className="mt-3 max-w-xl text-fg-muted">
              Cifras de ejemplo para la plantilla. Se actualizarán con los datos
              oficiales del Ministerio.
            </p>
            <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {infancias.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-sm text-fg-muted">{stat.label}</dt>
                  <dd className="mt-2 font-display text-4xl font-semibold tracking-tight text-bg-deep">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section
        id="agenda"
        className="scroll-mt-24 border-t border-line bg-bg-soft/60 py-16 sm:py-20"
      >
        <div className="section-shell">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-infancias">
              Agenda
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              Horarios y actividades
            </h2>
            <p className="mt-3 mb-10 max-w-xl text-fg-muted">
              Calendario plantilla con actividades de ejemplo en distintas
              localidades.
            </p>
            <EventSchedule />
          </Reveal>
        </div>
      </section>

      <section className="bg-bg py-16 sm:py-20">
        <div className="section-shell">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bg-mid">
              Mapa
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              Mapa de actividades
            </h2>
            <p className="mt-3 mb-10 max-w-xl text-fg-muted">
              Vista plantilla centrada en La Rioja. Los puntos listados son de
              ejemplo.
            </p>
            <ActivityMap />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-bg-soft/50 py-16 sm:py-20">
        <div className="section-shell">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Sedes
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              Puntos de encuentro
            </h2>
            <p className="mt-3 mb-10 max-w-xl text-fg-muted">
              Listado plantilla de sedes. Reemplazar por direcciones y horarios
              oficiales.
            </p>
            <ul className="grid gap-8 sm:grid-cols-2">
              {infancias.venues.map((venue) => (
                <li key={venue.id} className="border-t border-line pt-5">
                  <h3 className="font-display text-xl font-semibold text-bg-deep">
                    {venue.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-fg">
                    {venue.city}
                  </p>
                  <p className="mt-1 text-sm text-fg-muted">{venue.address}</p>
                  <p className="mt-2 text-sm text-fg-muted/90">{venue.note}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-bg-deep py-14 text-fg-on-dark">
        <div className="section-shell flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight">
              ¿Listo para volver al inicio?
            </p>
            <p className="mt-2 text-sm text-fg-on-dark/75">
              Seguimos construyendo la página oficial del Ministerio.
            </p>
          </div>
          <Link href="/" className="btn-primary">
            Ir al inicio
          </Link>
        </div>
      </section>
    </>
  );
}
