import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-bg-footer text-fg-on-dark">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight">
            {site.fullName}
          </p>
          <p className="mt-2 text-sm text-fg-on-dark/75">{site.province}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-on-dark/70">
            Contenido plantilla. Los datos de contacto y redes se actualizarán
            con la información oficial del Ministerio.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Contacto
          </p>
          <ul className="mt-4 space-y-2 text-sm text-fg-on-dark/85">
            <li>{site.contact.address}</li>
            <li>
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-accent"
              >
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="transition-colors hover:text-accent"
              >
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Redes
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {site.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-on-dark/85 transition-colors hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link
              href="/mes-de-las-infancias"
              className="text-sm font-semibold text-accent transition-opacity hover:opacity-85"
            >
              Festi Peques — Mes de las Infancias →
            </Link>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs text-fg-on-dark/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.fullName}. {site.province}.
          </p>
          <p>Sitio en construcción — versión plantilla</p>
        </div>
      </div>
    </footer>
  );
}
