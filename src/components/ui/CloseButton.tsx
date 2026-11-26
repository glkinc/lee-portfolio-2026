import { forwardRef } from "react";

/** Figma "icon-close" — outlined circle, fills dark on hover. */
export const CloseButton = forwardRef<HTMLButtonElement, { onClick: () => void; label: string }>(function CloseButton(
  { onClick, label },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group grid size-12 shrink-0 place-items-center rounded-full border-2 border-border-strong text-text-primary transition-[background-color,color,transform] duration-200 hover:rotate-90 hover:bg-bg-inverse hover:text-text-inverse active:scale-95 motion-reduce:hover:rotate-0"
    >
      <svg width="20" height="20" viewBox="-1 -1 22 22" aria-hidden="true" fill="none">
        <path d="M0 0L20 20M20 0L0 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
});
