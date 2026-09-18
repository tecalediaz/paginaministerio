import Link from "next/link";
import { TramiteForm } from "@/components/TramiteForm";
import { getNeed } from "@/content/needs";
import { site } from "@/content/site";
import { areaOf, type Tramite } from "@/lib/tramite";
import {
  formatPagoEstado,
  type PagoPublico,
} from "@/lib/pagos";

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function PagosTable({ items }: { items: PagoPublico[] }) {
  if (items.length === 0) {
    return (
      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-lg font-bold text-brand-navy">Pagos acreditados</h2>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Todavía no hay acreditaciones publicadas. Cuando el ministerio informe
          el pago de un programa, va a aparecer en esta tabla.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 border-t border-line pt-8">
      <h2 className="text-lg font-bold text-brand-navy">Pagos acreditados</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="py-3 pr-4 text-sm font-bold tracking-wide text-fg-muted uppercase">
                Programa
              </th>
              <th className="py-3 pr-4 text-sm font-bold tracking-wide text-fg-muted uppercase">
                Periodo
              </th>
              <th className="py-3 text-sm font-bold tracking-wide text-fg-muted uppercase">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const estado = formatPagoEstado(
                new Date(item.scheduledAt),
                item.paidAt ? new Date(item.paidAt) : null,
              );
              return (
                <tr key={item.id} className="border-b border-line align-top">
                  <td className="py-4 pr-4 font-semibold">{item.programa}</td>
                  <td className="py-4 pr-4">{item.periodo}</td>
                  <td className="py-4">
                    <span
                      className={
                        estado.status === "paid"
                          ? "font-semibold"
                          : "text-fg-muted"
                      }
                    >
                      {estado.label}
                    </span>
                    {item.note ? (
                      <p className="mt-1 text-sm text-fg-muted">{item.note}</p>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ServiceSheet({
  tramite,
  pagos = [],
}: {
  tramite: Tramite;
  pagos?: PagoPublico[];
}) {
  const area = areaOf(tramite);
  const need = getNeed(tramite.need);
  const requisitos = lines(tramite.requirements);
  const isPagos = tramite.kind === "pagos";

  const rows: { label: string; value: string; href?: string }[] = [];
  if (tramite.summary) rows.push({ label: "Qué es", value: tramite.summary });
  if (!isPagos && tramite.who) {
    rows.push({ label: "Quién puede acceder", value: tramite.who });
  }
  if (!isPagos && tramite.how) {
    rows.push({ label: "Cómo se hace", value: tramite.how });
  }
  if (!isPagos && requisitos.length === 1) {
    rows.push({ label: "Requisitos", value: requisitos[0] });
  }
  if (tramite.notes) {
    rows.push({ label: "Notas", value: tramite.notes });
  }
  if (isPagos) {
    rows.push({
      label: "Responsable",
      value: site.fullName,
    });
  } else {
    rows.push({
      label: "Área responsable",
      value: area.name,
      href: `/areas/${area.slug}`,
    });
  }

  const ficha = (
    <dl className="divide-y divide-line">
      {rows.map((row) => (
        <div key={row.label} className="grid gap-2 py-4">
          <dt className="text-sm font-bold tracking-wide text-fg-muted uppercase">
            {row.label}
          </dt>
          <dd className="min-w-0 break-words">
            {row.href ? (
              <Link className="font-semibold text-accent-warm" href={row.href}>
                {row.value}
              </Link>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
      {!isPagos && requisitos.length > 1 ? (
        <div className="grid gap-2 py-4">
          <dt className="text-sm font-bold tracking-wide text-fg-muted uppercase">
            Requisitos
          </dt>
          <dd className="min-w-0 break-words">
            <ul className="list-disc space-y-1 pl-5">
              {requisitos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
      ) : null}
    </dl>
  );

  return (
    <>
      <div className="grid gap-10 pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start lg:pb-0">
        <article>
          <p className="kicker">{isPagos ? "Ministerio" : need.label}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-brand-navy sm:text-4xl">
            {tramite.title}
          </h1>
          {isPagos ? <PagosTable items={pagos} /> : null}
          {!isPagos && tramite.formFields.length > 0 ? (
            <div className="mt-10">
              <TramiteForm slug={tramite.slug} fields={tramite.formFields} />
            </div>
          ) : null}
        </article>
        <aside className="h-fit space-y-6">
          {rows.length > 0 || requisitos.length > 1 ? (
            <div className="border border-line bg-white px-5 py-4">
              {ficha}
            </div>
          ) : null}
          <div className="border border-line bg-white p-5">
            <p className="text-sm font-bold">¿Necesitás orientación ahora?</p>
            <p className="mt-2 text-sm text-fg-muted">
              {site.contact.address}. {site.contact.hours}.
            </p>
            <a
              className="mt-4 inline-flex min-h-11 items-center font-bold text-accent-warm"
              href={site.contact.phoneHref}
            >
              Llamar {site.contact.phone}
            </a>
            <br />
            <a
              className="inline-flex min-h-11 items-center font-bold text-accent-warm"
              href={site.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </aside>
      </div>
      <div className="sheet-actions">
        <a data-tone="primary" href={site.contact.phoneHref}>
          Llamar
        </a>
        <a
          data-tone="secondary"
          href={site.contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </>
  );
}
