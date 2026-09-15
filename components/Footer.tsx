import Link from "next/link";
import { areas } from "@/content/areas";
import { site } from "@/content/site";
import { SocialLinks } from "@/components/SocialLinks";

export function Footer() {
  return (
    <footer className="mt-auto bg-bg-deep text-fg-on-dark">
      <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="kicker text-accent">Gobierno de La Rioja</p>
          <p className="mt-3 max-w-sm text-lg font-bold leading-snug">
            {site.fullName}
          </p>
          <p className="mt-3 text-sm text-white/70">
            {site.minister.title}: {site.minister.name}
          </p>
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide uppercase">Áreas</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {areas.slice(0, 8).map((area) => (
              <li key={area.slug}>
                <Link className="hover:text-white" href={`/areas/${area.slug}`}>
                  {area.name}
                </Link>
              </li>
            ))}
            <li>
              <Link className="font-semibold text-accent hover:text-white" href="/areas">
                Ver todas las áreas
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide uppercase">Contacto</p>
          <address className="mt-3 space-y-2 text-sm not-italic text-white/80">
            <p>{site.contact.address}</p>
            <p>{site.contact.city}</p>
            <p>{site.contact.hours}</p>
            <p>
              <a className="hover:text-white" href={site.contact.phoneHref}>
                {site.contact.phone}
              </a>
            </p>
            <p>
              <a className="hover:text-white" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </p>
          </address>
          <div className="mt-4">
            <SocialLinks inverted />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="shell py-4 text-xs text-white/55">
          Sitio oficial · {site.province}
        </p>
      </div>
    </footer>
  );
}
