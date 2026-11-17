import type { ReactNode } from "react";

const URL_RE = /(?:https?:\/\/|www\.)[^\s<]+/gi;

function splitTrailing(raw: string) {
  const match = raw.match(/^(.*?)([),.;:!?]+)$/);
  if (!match?.[1]) return { core: raw, trailing: "" };
  return { core: match[1], trailing: match[2] };
}

function safeHref(core: string) {
  const withScheme = /^www\./i.test(core) ? `https://${core}` : core;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function LinkedText({ text, className }: { text: string; className?: string }) {
  const source = text.replaceAll("\r\n", "\n");
  const nodes: ReactNode[] = [];
  let last = 0;

  for (const match of source.matchAll(URL_RE)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(source.slice(last, start));
    const { core, trailing } = splitTrailing(match[0]);
    const href = safeHref(core);
    if (href) {
      nodes.push(
        <a
          key={`${start}-${href}`}
          href={href}
          className="font-medium text-[#1565c0] underline decoration-[#1565c0]/40 underline-offset-2 hover:text-[#0d47a1]"
          target="_blank"
          rel="noopener noreferrer"
        >
          {core}
        </a>,
      );
    } else {
      nodes.push(core);
    }
    if (trailing) nodes.push(trailing);
    last = start + match[0].length;
  }

  if (last < source.length) nodes.push(source.slice(last));

  return (
    <p className={`whitespace-pre-line break-words [overflow-wrap:anywhere] ${className ?? ""}`}>
      {nodes}
    </p>
  );
}
