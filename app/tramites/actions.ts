"use server";

import { getPublishedTramite } from "@/lib/tramites";
import {
  tramiteFormInicial,
  validateTramiteForm,
  type TramiteFormState,
} from "@/lib/tramite-form";

export async function enviarTramite(
  _prev: TramiteFormState,
  formData: FormData,
): Promise<TramiteFormState> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false, errors: { form: "Trámite inválido." } };

  const tramite = await getPublishedTramite(slug);
  if (!tramite || tramite.kind === "pagos" || tramite.formFields.length === 0) {
    return { ok: false, errors: { form: "Este trámite no recibe formularios." } };
  }

  const result = validateTramiteForm(formData, tramite.formFields);
  if (!result.ok) return result;
  return { ok: true, errors: {} };
}

export { tramiteFormInicial };
