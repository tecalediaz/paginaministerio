"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  options: SelectOption[];
  name?: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className={`ui-select__chevron size-5 shrink-0 text-brand-navy ${open ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Select({
  options,
  name,
  id,
  value,
  defaultValue = "",
  placeholder = "Elegí una opción",
  required = false,
  disabled = false,
  className = "",
  onChange,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SelectProps) {
  const listId = useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value : internal;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [openUp, setOpenUp] = useState(false);
  const [maxHeight, setMaxHeight] = useState(280);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedIndex = options.findIndex((option) => option.value === current);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const commit = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [isControlled, onChange],
  );

  const updatePlacement = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom - gap - 8;
    const spaceAbove = rect.top - gap - 8;
    const shouldOpenUp = spaceBelow < 160 && spaceAbove > spaceBelow;
    setOpenUp(shouldOpenUp);
    setMaxHeight(
      Math.min(280, Math.max(132, shouldOpenUp ? spaceAbove : spaceBelow)),
    );
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    updatePlacement();
  }, [open, selectedIndex, updatePlacement]);

  useEffect(() => {
    if (!open) return;
    const onWin = () => updatePlacement();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open, updatePlacement]);

  useEffect(() => {
    if (!open) return;
    const onPtr = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPtr);
    return () => document.removeEventListener("pointerdown", onPtr);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-select-option="${active}"]`,
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => listRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const move = (dir: 1 | -1) => {
    if (options.length === 0) return;
    setActive((index) => (index + dir + options.length) % options.length);
  };

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setActive(options.length - 1);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[active];
      if (option) commit(option.value);
      return;
    }
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const q = event.key.toLowerCase();
      const index = options.findIndex((option) =>
        option.label.toLowerCase().startsWith(q),
      );
      if (index >= 0) setActive(index);
    }
  };

  return (
    <div ref={rootRef} className={`ui-select relative ${className}`.trim()}>
      {name ? <input type="hidden" name={name} value={current} /> : null}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-required={required || undefined}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-activedescendant={open ? `${listId}-opt-${active}` : undefined}
        onClick={() => {
          if (disabled) return;
          setOpen((isOpen) => !isOpen);
        }}
        onKeyDown={onTriggerKeyDown}
        className="flex h-14 w-full min-w-0 items-center justify-between gap-3 rounded-[6px] border border-line bg-white px-4 text-left text-base disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          className={`min-w-0 truncate ${selected ? "text-fg" : "text-fg-muted"}`}
        >
          {selected?.label ?? placeholder}
        </span>
        <Chevron open={open} />
      </button>
      {open ? (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listId}-opt-${active}`}
          onKeyDown={onListKeyDown}
          style={{ maxHeight }}
          className={`ui-select__list absolute inset-x-0 z-50 overflow-y-auto overscroll-contain rounded-[6px] border border-line bg-white py-1 shadow-[0_8px_30px_rgba(58,58,58,0.12)] outline-none ${
            openUp ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === current;
            const isActive = index === active;
            return (
              <div
                key={option.value === "" ? `__empty-${index}` : option.value}
                id={`${listId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                data-select-option={index}
                onMouseEnter={() => setActive(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => commit(option.value)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-base ${
                  isActive ? "bg-bg-soft text-brand-navy" : "text-fg"
                } ${isSelected ? "font-semibold text-brand-navy" : ""}`}
              >
                <span className="min-w-0">{option.label}</span>
                {isSelected ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                    className="size-4 shrink-0 text-accent"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
