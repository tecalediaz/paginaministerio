"use server";

import { headers } from "next/headers";
import { saveTramiteSubmission } from "@/lib/tramite-reception";
import type { TramiteFormState } from "@/lib/tramite-form";

export async function enviarTramite(
  _prev: TramiteFormState,
  formData: FormData,
): Promise<TramiteFormState> {
  return saveTramiteSubmission(formData, await headers());
}
