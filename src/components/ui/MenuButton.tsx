import { motion } from "motion/react";
import { forwardRef } from "react";

const spring = { type: "spring", stiffness: 420, damping: 30 } as const;

/**
 * Round menu button (Figma "icon-menu") that morphs into the close "X" of the
 * mobile menu: the bars rotate into a cross, lengthen, and flip from dark to
 * white while the white fill and drop shadow (matching the desktop nav pill)
 * fade away over the dark menu.
 */
export const MenuButton = forwardRef<HTMLButtonElement, { open: boolean; onToggle: () => void; controls: string }>(
  function MenuButton({ open, onToggle, controls }, ref) {
    // Token values (colour/grey/0, colour/grey/900) as hex so Motion can tween them.
    const color = open ? "#ffffff" : "#171717";
    return (
      <motion.button
        ref={ref}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={controls}
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-20 flex size-12 items-center justify-center rounded-full"
        initial={false}
        animate={{
          rotate: open ? 90 : 0,
          backgroundColor: open ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)",
          boxShadow: open ? "0 0 4px rgba(0,0,0,0)" : "0 0 4px rgba(0,0,0,0.25)",
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={spring}
      >
        <motion.span
          aria-hidden="true"
          className="absolute h-0.5 rounded-full"
          initial={false}
          animate={{ y: open ? 0 : -4, rotate: open ? 45 : 0, width: open ? 28 : 20, backgroundColor: color }}
          transition={spring}
        />
        <motion.span
          aria-hidden="true"
          className="absolute h-0.5 rounded-full"
          initial={false}
          animate={{ y: open ? 0 : 4, rotate: open ? -45 : 0, width: open ? 28 : 20, backgroundColor: color }}
          transition={spring}
        />
      </motion.button>
    );
  },
);
