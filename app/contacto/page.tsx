import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Sede, horario, teléfono y WhatsApp del Ministerio de Desarrollo, Igualdad e Integración Social de La Rioja.",
};

export default function ContactoPage() {
  return (
    <div className="shell py-8 sm:py-12">
      <Breadcrumb
        items={[
          { href: "/", label: "Inicio" },
          { label: "Contacto" },
        ]}
      />
      <p className="kicker mt-6">Sede central</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">Contacto</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p>
            {site.contact.address}, {site.contact.city}.
          </p>
          <p>
            Horario: <strong>{site.contact.hours}</strong>
          </p>
          <p>
            Teléfono:{" "}
            <a className="font-bold text-accent-warm" href={site.contact.phoneHref}>
              {site.contact.phone}
            </a>
          </p>
          <p>
            Correo:{" "}
            <a
              className="font-bold text-accent-warm"
              href={`mailto:${site.contact.email}`}
            >
              {site.contact.email}
            </a>
          </p>
          <p>
            <a
              className="inline-flex min-h-11 items-center font-bold text-accent-warm"
              href={site.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </p>
          <SocialLinks />
        </div>
        <div>
          <iframe
            title="Mapa de la sede central"
            src={site.contact.mapSrc}
            loading="lazy"
            className="h-80 w-full border border-line"
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
