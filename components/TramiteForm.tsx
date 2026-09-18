"use client";

import { useActionState, useState } from "react";
import { enviarTramite } from "@/app/tramites/actions";
import { Select } from "@/components/Select";
import {
  isNombreField,
  NOMBRE_MAX_PALABRAS,
  normalizarNombre,
  sanitizeDni,
  tramiteFormInicial,
  type TramiteFormField,
} from "@/lib/tramite-form";

const inputClass =
  "h-14 w-full rounded-[6px] border border-line bg-white px-4 text-base";

function autocompleteFor(type: TramiteFormField["type"]) {
  if (type === "email") return "email";
  if (type === "tel") return "tel";
  if (type === "text") return "name";
  return "off";
}

function inputModeFor(type: TramiteFormField["type"]) {
  if (type === "email") return "email" as const;
  if (type === "tel") return "numeric" as const;
  if (type === "dni") return "numeric" as const;
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
}: {
  slug: string;
  fields: TramiteFormField[];
}) {
  const [state, action, pending] = useActionState(
    enviarTramite,
    tramiteFormInicial,
  );

  if (fields.length === 0) return null;

  if (state.ok) {
    return (
      <div
        className="border border-line bg-white px-5 py-6 sm:px-6 sm:py-7"
        role="status"
        aria-live="polite"
      >
        <p className="kicker">Trámite</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-navy">
          Solicitud enviada
        </h2>
        <p className="mt-3 leading-relaxed text-fg-muted">
          Recibimos tu consulta. Si necesitás confirmar o continuar, usá
          teléfono, WhatsApp o acercate a la sede.
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="border border-line bg-white px-5 py-6 sm:px-6 sm:py-7"
      noValidate
      onSubmit={(event) => {
        for (const el of event.currentTarget.querySelectorAll<HTMLInputElement>(
          "input[data-nombre-field]",
        )) {
          el.value = normalizarNombre(el.value).value;
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <h2 className="text-xl font-black tracking-tight text-brand-navy">
        Formulario
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        Completá los datos para este trámite.
      </p>
      {state.errors.form ? (
        <p className="mt-4 text-sm font-semibold text-brand-red" role="alert">
          {state.errors.form}
        </p>
      ) : null}
      <div className="mt-6 grid gap-5">
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
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-[6px] bg-accent px-5 font-bold text-white hover:bg-accent-warm disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
