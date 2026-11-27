import { motion } from "motion/react";
import { useRef, type KeyboardEvent } from "react";
import { useTileTheme, type TileAccent } from "../bauhaus/TileTheme";

const options: { value: TileAccent; label: string; color: string }[] = [
  { value: null, label: "Original colours", color: "var(--color-grey-900)" },
  { value: "red", label: "Red", color: "var(--color-red-500)" },
  { value: "blue", label: "Blue", color: "var(--color-blue-500)" },
  { value: "yellow", label: "Yellow", color: "var(--color-yellow-500)" },
];

/**
 * Hero colour swatches (Figma "color-toggle"). Easter egg: picking a colour
 * repaints every Bauhaus tile on the site in that colour with no background;
 * the grey swatch restores the original design.
 */
export function Swatches({ className }: { className?: string }) {
  const { accent, setAccent } = useTileTheme();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = (index + dir + options.length) % options.length;
    setAccent(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Bauhaus tile colours" className={className}>
      {options.map((o, i) => {
        const checked = accent === o.value;
        return (
          <motion.button
            key={o.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={o.label}
            tabIndex={checked ? 0 : -1}
            onClick={() => setAccent(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            // The grey "original" swatch comes first: left of the row on small screens, top of the column on large ones.
            className="relative grid size-(--swatch,56px) shrink-0 place-items-center rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-0.5 rounded-full border-4"
              style={{ borderColor: o.color }}
              initial={false}
              animate={{ scale: checked ? 1 : 0.6, opacity: checked ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
            />
            <span aria-hidden="true" className="size-[72%] rounded-full" style={{ backgroundColor: o.color }} />
          </motion.button>
        );
      })}
    </div>
  );
}
