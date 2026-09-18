import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SedeHours } from "@/components/SedeHours";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Sede, horario, teléfono y WhatsApp del Ministerio de Desarrollo, Igualdad e Integración Social de La Rioja.",
};

export default function ContactoPage() {
  return (
    <div className="shell pt-4 pb-8 sm:pt-6 sm:pb-12">
      <Breadcrumb
        items={[
          { href: "/", label: "Inicio" },
          { label: "Contacto" },
        ]}
      />
      <h1 className="mt-6 text-3xl font-black tracking-tight text-brand-navy sm:text-4xl">Contacto</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p>
            {site.contact.address}, {site.contact.city}.
          </p>
          <div>
            <p className="kicker">Horario</p>
            <SedeHours hours={site.contact.hours} />
          </div>
          <div className="grid gap-3">
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-accent font-bold text-white hover:bg-accent-warm"
              href={site.contact.phoneHref}
            >
              Llamar {site.contact.phone}
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-[6px] border border-line font-bold hover:bg-bg-soft"
              href={site.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribir por WhatsApp
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-[6px] border border-line font-bold hover:bg-bg-soft"
              href={`mailto:${site.contact.email}`}
            >
              Enviar correo
            </a>
          </div>
          <SocialLinks />
        </div>
        <div>
          <iframe
            title="Mapa de la sede central"
            src={site.contact.mapSrc}
            loading="lazy"
            className="h-64 w-full border border-line sm:h-80"
          />
          <a
            className="mt-3 inline-flex min-h-11 items-center text-sm font-bold"
            href={site.contact.mapLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir mapa
          </a>
        </div>
      </div>
    </div>
  );
}
