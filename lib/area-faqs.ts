export type PublicAreaFaq = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_FAQS = 30;

function asFaqList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Keeps saved order. Only rows marked published in the CMS are public. */
export function publishedAreaFaqs(raw: unknown): PublicAreaFaq[] {
  const seen = new Set<string>();
  const faqs: PublicAreaFaq[] = [];

  for (const item of asFaqList(raw)) {
    if (faqs.length >= MAX_FAQS) break;
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    if (row.published !== true) continue;

    const id = typeof row.id === "string" ? row.id : "";
    const question = typeof row.question === "string" ? row.question.trim() : "";
    const answer = typeof row.answer === "string" ? row.answer.trim() : "";
    if (!FAQ_ID.test(id) || seen.has(id) || !question || !answer) continue;
    if (question.length > 200 || answer.length > 4000) continue;

    seen.add(id);
    faqs.push({ id, question, answer });
  }

  return faqs;
}
