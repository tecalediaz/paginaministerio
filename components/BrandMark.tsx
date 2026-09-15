import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function BrandMark({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-3" onClick={onNavigate}>
      <Image
        src="/logo-gob-rioja.svg"
        alt=""
        width={48}
        height={54}
        className={compact ? "h-9 w-auto" : "h-11 w-auto sm:h-12"}
        priority
      />
      <Image
        src="/ministerio.svg"
        alt={site.fullName}
        width={420}
        height={90}
        className={`w-auto object-contain object-left ${
          compact
            ? "h-7 max-w-[min(100%,168px)] sm:h-8 sm:max-w-[220px]"
            : "h-8 max-w-[min(100%,200px)] sm:h-10 sm:max-w-[280px]"
        }`}
        priority
      />
    </Link>
  );
}
