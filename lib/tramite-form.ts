export const TRAMITE_FORM_FIELD_TYPES = [
  "text",
  "email",
  "tel",
  "dni",
  "select",
  "textarea",
] as const;

export type TramiteFormFieldType = (typeof TRAMITE_FORM_FIELD_TYPES)[number];

export type TramiteFormField = {
  id: string;
  name: string;
  type: TramiteFormFieldType;
  label: string;
  required: boolean;
  maxLength?: number;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export type TramiteFormState = {
  ok: boolean;
  errors: Record<string, string>;
};

export const tramiteFormInicial: TramiteFormState = {
  ok: false,
  errors: {},
};

export const NOMBRE_MAX_PALABRAS = 8;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isNombreField(field: Pick<TramiteFormField, "name" | "type">) {
  return field.type === "text" && (field.name === "nombre" || field.name === "name");
}

function titleCasePalabra(word: string) {
  let result = "";
  let capitalizeNext = true;
  for (const char of word) {
    if (char === "-" || char === "'") {
      result += char;
      capitalizeNext = true;
      continue;
    }
    result += capitalizeNext
      ? char.toLocaleUpperCase("es-AR")
      : char.toLocaleLowerCase("es-AR");
    capitalizeNext = false;
  }
  return result;
}

export function normalizarNombre(
  value: string,
  options?: { allowTrailingSpace?: boolean },
): { value: string; truncated: boolean } {
  const allowTrailingSpace = options?.allowTrailingSpace === true;
  const wantedTrailing = allowTrailingSpace && /\s$/.test(value);
  const palabras = value.trim().split(/\s+/).filter(Boolean);
  const truncated =
    palabras.length > NOMBRE_MAX_PALABRAS ||
    (palabras.length === NOMBRE_MAX_PALABRAS && wantedTrailing);
  const kept = palabras
    .slice(0, NOMBRE_MAX_PALABRAS)
    .map(titleCasePalabra);
  let next = kept.join(" ");
  if (wantedTrailing && kept.length > 0 && kept.length < NOMBRE_MAX_PALABRAS) {
    next += " ";
  }
  return { value: next, truncated };
}

function isFieldType(value: string): value is TramiteFormFieldType {
  return (TRAMITE_FORM_FIELD_TYPES as readonly string[]).includes(value);
}

export function parseTramiteFormFields(raw: unknown): TramiteFormField[] {
  if (!Array.isArray(raw)) return [];
  const used = new Set<string>();
  const fields: TramiteFormField[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const row = item as Record<string, unknown>;
    if (typeof row.id !== "string" || !row.id.trim()) continue;
    if (typeof row.label !== "string" || !row.label.trim()) continue;
    if (typeof row.type !== "string" || !isFieldType(row.type)) continue;
    const name =
      typeof row.name === "string" && /^[a-z][a-z0-9_]{0,63}$/.test(row.name)
        ? row.name
        : "";
    if (!name || used.has(name)) continue;
    used.add(name);

    const field: TramiteFormField = {
      id: row.id.trim(),
      name,
      type: row.type,
      label: row.label.trim().slice(0, 160),
      required: row.required === true,
    };

    if (typeof row.maxLength === "number" && Number.isFinite(row.maxLength)) {
      const maxLength = Math.round(row.maxLength);
      if (maxLength >= 1 && maxLength <= 4000) field.maxLength = maxLength;
    }
    if (row.type === "dni") field.maxLength = 8;
    if (typeof row.placeholder === "string" && row.placeholder.trim()) {
      field.placeholder = row.placeholder.trim().slice(0, 160);
    }
    if (row.type === "select" && Array.isArray(row.options)) {
      const options = row.options
        .filter(
          (option): option is { value: string; label: string } =>
            Boolean(
              option &&
                typeof option === "object" &&
                !Array.isArray(option) &&
                typeof (option as { value?: unknown }).value === "string" &&
                typeof (option as { label?: unknown }).label === "string" &&
                (option as { value: string }).value.trim() &&
                (option as { label: string }).label.trim(),
            ),
        )
        .map((option) => ({
          value: option.value.trim().slice(0, 80),
          label: option.label.trim().slice(0, 160),
        }));
      if (options.length === 0) continue;
      field.options = options;
    }

    fields.push(field);
  }

  return fields.slice(0, 30);
}

function read(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function digits(value: string) {
  return value.replace(/\D/g, "");
}

/** Solo 0-9, máximo 8. Quita puntos, espacios, guiones y letras. */
export function sanitizeDni(value: string) {
  return digits(value).slice(0, 8);
}

export function validateTramiteForm(
  formData: FormData,
  fields: TramiteFormField[],
): TramiteFormState {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const raw = read(formData, field.name);
    const max = field.maxLength ?? (field.type === "textarea" ? 2000 : 160);

    if (field.type === "dni") {
      if (!raw) {
        if (field.required) errors[field.name] = "Completá este campo.";
        continue;
      }
      const dni = digits(raw);
      if (dni.length < 7 || dni.length > 8) {
        errors[field.name] = "Ingresá un DNI de 7 u 8 números.";
      }
      continue;
    }

    if (!raw) {
      if (field.required) errors[field.name] = "Completá este campo.";
      continue;
    }
    if (raw.length > max) {
      errors[field.name] = `Máximo ${max} caracteres.`;
      continue;
    }

    if (isNombreField(field)) {
      const palabras = raw.split(/\s+/).filter(Boolean);
      if (palabras.length > NOMBRE_MAX_PALABRAS) {
        errors[field.name] = `Máximo ${NOMBRE_MAX_PALABRAS} palabras.`;
      } else if (raw !== normalizarNombre(raw).value) {
        errors[field.name] = "Escribí cada palabra con mayúscula inicial.";
      }
    } else if (field.type === "email" && !EMAIL.test(raw)) {
      errors[field.name] = "Ingresá un correo electrónico válido.";
    } else if (field.type === "tel") {
      if (digits(raw).length < 8) {
        errors[field.name] = "Ingresá un teléfono de contacto.";
      }
    } else if (field.type === "select") {
      const allowed = new Set((field.options ?? []).map((option) => option.value));
      if (!allowed.has(raw)) {
        errors[field.name] = "Elegí una opción.";
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, errors: {} };
}
