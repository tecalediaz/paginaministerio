import type { ReactNode } from "react";

export function ProgramIcon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-fp-navy"
    >
      {children}
    </span>
  );
}

export function IconBulb() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 18h6M10 21h4" strokeLinecap="round" />
      <path d="M12 3a6 6 0 0 0-3.5 10.8c.6.5 1 1.2 1.1 2h4.8c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

export function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3 5 6v5.5c0 4.2 2.8 7.9 7 9 4.2-1.1 7-4.8 7-9V6l-7-3Z" />
    </svg>
  );
}

export function IconBook() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
      <path d="M4 5.5v16" strokeLinecap="round" />
    </svg>
  );
}

export function IconPin() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}
