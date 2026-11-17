import "server-only";
import { publishedAreaFaqs, type PublicAreaFaq } from "@/lib/area-faqs";
import { sqlFor } from "@/lib/sql";

export async function getAreaFaqs(areaSlug: string): Promise<PublicAreaFaq[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];

  try {
    const rows = await sqlFor(url)<{ faqs: unknown }[]>`
      SELECT faqs
      FROM site_area_content
      WHERE area_slug = ${areaSlug}
      LIMIT 1
    `;
    return publishedAreaFaqs(rows[0]?.faqs);
  } catch (error) {
    console.error("No se pudieron leer las preguntas del área", error);
    return [];
  }
}
