"use client";

import { useState } from "react";
import { formatPagoEstado, type PagoPublico } from "@/lib/pagos";

export function PagosTable({ items }: { items: PagoPublico[] }) {
  const [visible, setVisible] = useState(10);
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
            {items.slice(0, visible).map((item) => {
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {visible < items.length ? <div className="mt-6 flex justify-center"><button type="button" className="min-h-11 rounded-md border border-line px-5 py-2 font-semibold" onClick={() => setVisible(value => value + 10)}>Mostrar más</button></div> : null}
    </div>
  );
}
