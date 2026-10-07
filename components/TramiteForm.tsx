"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { enviarTramite } from "@/app/tramites/actions";
import { Select } from "@/components/Select";
import {
  isNombreField,
  NOMBRE_MAX_PALABRAS,
  normalizarNombre,
  sanitizeDni,
  tramiteFormInicial,
  type TramiteFormField,
  type TramiteFormState,
} from "@/lib/tramite-form";

const inputClass =
  "h-14 w-full rounded-[6px] border border-line bg-white px-4 text-base";

async function sendPreservingFields(previous: TramiteFormState, data: FormData): Promise<TramiteFormState> {
  try { return await enviarTramite(previous, data); }
  catch { return { ok: false, errors: { form: "No pudimos confirmar el envío. Tus datos siguen en el formulario; revisá la conexión e intentá nuevamente." } }; }
}

function autocompleteFor(type: TramiteFormField["type"]) {
  if (type === "email") return "email";
  if (type === "tel") return "tel";
  if (type === "text") return "name";
  return "off";
}

function inputModeFor(type: TramiteFormField["type"]) {
  if (type === "email") return "email" as const;
  if (type === "tel") return "numeric" as const;
  if (type === "dni" || type === "number") return "numeric" as const;
  return undefined;
}

function applyNombre(el: HTMLInputElement, allowTrailingSpace: boolean) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const before = el.value;
  const { value, truncated } = normalizarNombre(before, { allowTrailingSpace });
  if (value !== before) {
    el.value = value;
    if (start != null && end != null && value.length === before.length) {
      el.setSelectionRange(start, end);
    } else if (start != null) {
      const next = Math.min(value.length, start);
      el.setSelectionRange(next, next);
    }
  }
  return truncated;
}

function NombreInput({
  field,
  id,
  error,
  errorId,
}: {
  field: TramiteFormField;
  id: string;
  error?: string;
  errorId: string;
}) {
  const [limitError, setLimitError] = useState<string | undefined>();
  const visibleError = error || limitError;

  function sync(el: HTMLInputElement, allowTrailingSpace: boolean) {
    const truncated = applyNombre(el, allowTrailingSpace);
    setLimitError(
      truncated ? `Máximo ${NOMBRE_MAX_PALABRAS} palabras.` : undefined,
    );
  }

  return (
    <>
      <input
        id={id}
        name={field.name}
        type="text"
        data-nombre-field=""
        autoComplete="name"
        autoCapitalize="words"
        autoCorrect="off"
        spellCheck={false}
        required={field.required}
        maxLength={field.maxLength ?? 160}
        placeholder={field.placeholder}
        aria-invalid={visibleError ? true : undefined}
        aria-describedby={visibleError ? errorId : undefined}
        className={`mt-2 ${inputClass}`}
        onInput={(event) => sync(event.currentTarget, true)}
        onBlur={(event) => sync(event.currentTarget, false)}
      />
      {visibleError ? (
        <p id={errorId} className="mt-2 text-sm font-semibold text-brand-red">
          {visibleError}
        </p>
      ) : null}
    </>
  );
}

export function TramiteForm({
  slug,
  fields,
  booking = false,
  registration = false,
}: {
  slug: string;
  fields: TramiteFormField[];
  booking?: boolean;
  registration?: boolean;
}) {
  const [state, action, pending] = useActionState(
    sendPreservingFields,
    tramiteFormInicial,
  );
  const [bookingLabel, setBookingLabel] = useState("");
  const attempt = useRef<string | null>(null);

  if (fields.length === 0) return null;

  if (registration && state.unavailableDate) return <div role="alert" className="border border-line bg-bg-soft p-5"><h2 className="text-xl font-black text-brand-navy">Inscripción no disponible</h2><p className="mt-3">{state.errors.form}</p></div>;

  if (booking && state.unavailableDate) {
    return <div className="border border-line bg-bg-soft px-5 py-6" role="alert">
      <h2 className="text-xl font-black text-brand-navy">Lo sentimos, esta fecha se quedó sin cupos disponibles.</h2>
      {bookingLabel ? <p className="mt-3 font-semibold">{bookingLabel}</p> : null}
      <a href={`/tramites/${slug}`} className="mt-4 inline-flex min-h-11 items-center font-bold text-accent-warm">Ver otras fechas disponibles</a>
    </div>;
  }

  if (state.ok) {
    return (
      <div
        className="border border-line bg-white px-5 py-6 sm:px-6 sm:py-7"
        role="status"
        aria-live="polite"
      >
        <p className="kicker">Trámite</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-navy">
          {registration ? "Inscripción confirmada" : booking ? "Reserva confirmada" : "Solicitud enviada"}
        </h2>
        <p className="mt-3 leading-relaxed text-fg-muted">
          {registration ? "Tu inscripción quedó confirmada. Guardá el número de recepción para consultar al área." : booking ? "Tu lugar quedó reservado automáticamente. Guardá el número de reserva para consultar al área." : "Tu solicitud quedó registrada. Guardá el número de recepción para consultar por teléfono, WhatsApp o en sede."}
        </p>
        {booking && bookingLabel ? <p className="mt-3 font-bold text-brand-navy">{bookingLabel}</p> : null}
        {state.receiptId ? (
          <p className="mt-3 break-all text-sm font-semibold text-brand-navy">
            Número de recepción: {state.receiptId}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className="border border-line bg-white px-5 py-6 sm:px-6 sm:py-7"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (pending) return;
        if (booking) {
          const chosen = new FormData(event.currentTarget).get("reserva");
          setBookingLabel(fields.find(f => f.name === "reserva")?.options?.find(o => o.value === chosen)?.label ?? "");
        }
        attempt.current ??= crypto.randomUUID();
        const input = event.currentTarget.elements.namedItem("idempotency_key");
        if (input instanceof HTMLInputElement) input.value = attempt.current;
        for (const el of event.currentTarget.querySelectorAll<HTMLInputElement>(
          "input[data-nombre-field]",
        )) {
          el.value = normalizarNombre(el.value).value;
        }
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="idempotency_key" defaultValue="" />
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`tramite-${slug}-website`}>Dejá este campo vacío</label>
        <input id={`tramite-${slug}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <h2 className="text-xl font-black tracking-tight text-brand-navy">
        {registration ? "Inscribirme" : booking ? "Reservar un lugar" : "Formulario"}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        {registration ? "Completá tus datos. La inscripción confirma un lugar y se admite una por DNI." : booking ? "Elegí una fecha disponible y completá tus datos. Tu lugar se confirma al enviar." : "Completá los datos para este trámite."}
      </p>
      {state.errors.form ? (
        <p className="mt-4 text-sm font-semibold text-brand-red" role="alert">
          {state.errors.form}
        </p>
      ) : null}
      <fieldset disabled={pending} className="mt-6 grid min-w-0 gap-5">
        {fields.map((field) => {
          const error = state.errors[field.name];
          const errorId = `tramite-${field.name}-error`;
          const id = `tramite-${field.name}`;
          return (
            <div key={field.id}>
              <label htmlFor={id} className="text-sm font-bold text-brand-navy">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  name={field.name}
                  required={field.required}
                  maxLength={field.maxLength ?? 2000}
                  placeholder={field.placeholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  className={`mt-2 min-h-28 py-3 ${inputClass} h-auto`}
                />
              ) : field.type === "select" ? (
                <Select
                  id={id}
                  name={field.name}
                  required={field.required}
                  defaultValue=""
                  placeholder={field.placeholder ?? "Elegí una opción"}
                  options={field.options ?? []}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  className="mt-2"
                />
              ) : ["radio", "checkbox"].includes(field.type) ? (
                <fieldset className="mt-2 space-y-2" aria-describedby={error ? errorId : undefined}><legend className="sr-only">{field.label}</legend>
                  {(field.options ?? []).map(option => <label key={option.value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[6px] border border-line px-3 py-2">
                    <input type={field.type === "radio" ? "radio" : "checkbox"} name={field.name} value={option.value} className="size-4 shrink-0" />
                    <span>{option.label}</span>
                  </label>)}
                </fieldset>
              ) : field.type === "dni" ? (
                <input
                  id={id}
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  required={field.required}
                  maxLength={8}
                  placeholder={field.placeholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  className={`mt-2 ${inputClass}`}
                  onInput={(event) => {
                    event.currentTarget.value = sanitizeDni(
                      event.currentTarget.value,
                    );
                  }}
                />
              ) : isNombreField(field) ? (
                <NombreInput
                  field={field}
                  id={id}
                  error={error}
                  errorId={errorId}
                />
              ) : (
                <input
                  id={id}
                  name={field.name}
                  type={
                    field.type === "email"
                      ? "email"
                      : field.type === "tel"
                        ? "tel"
                        : "text"
                  }
                  onInput={field.type === "number" ? event => { event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, ""); } : undefined}
                  autoComplete={autocompleteFor(field.type)}
                  inputMode={inputModeFor(field.type)}
                  required={field.required}
                  maxLength={field.maxLength ?? 160}
                  placeholder={field.placeholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  className={`mt-2 ${inputClass}`}
                />
              )}
              {error && !isNombreField(field) ? (
                <p
                  id={errorId}
                  className="mt-2 text-sm font-semibold text-brand-red"
                >
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </fieldset>
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-[6px] bg-accent px-5 font-bold text-white hover:bg-accent-warm disabled:opacity-60 sm:w-auto"
      >
        {pending ? <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4 animate-spin"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3" /><path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" strokeWidth="3" /></svg> : null}
        {pending ? "Enviando…" : registration ? "Confirmar inscripción" : booking ? "Confirmar reserva" : "Enviar"}
      </button>
    </form>
  );
}
