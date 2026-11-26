import { motion, type HTMLMotionProps } from "motion/react";

const base =
  "label-md inline-flex items-center justify-center rounded-full px-6 py-3 whitespace-nowrap " +
  "bg-button-primary-bg text-button-primary-text transition-colors duration-200 " +
  "hover:bg-button-primary-bg-hover active:bg-button-primary-bg-active";

const roll = { duration: 0.45, ease: [0.76, 0, 0.24, 1] } as const;

/**
 * Mask rolling text: each letter slides up out of a mask while a duplicate
 * rolls in from below, staggered left to right. Screen readers get the plain
 * label once (the animated copies are hidden from them).
 */
export function RollingText({ text }: { text: string }) {
  const chars = Array.from(text);
  return (
    <span className="relative inline-flex">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="relative inline-flex overflow-hidden">
        {chars.map((c, i) => (
          <span key={i} className="relative inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              variants={{ rest: { y: "0%" }, hover: { y: "-100%" } }}
              transition={{ ...roll, delay: i * 0.012 }}
            >
              {c === " " ? " " : c}
            </motion.span>
            <motion.span
              className="absolute top-full left-0 inline-block"
              variants={{ rest: { y: "0%" }, hover: { y: "-100%" } }}
              transition={{ ...roll, delay: i * 0.012 }}
            >
              {c === " " ? " " : c}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
}

/** Right arrow that nudges forward on hover, in step with the rolling label. */
function Arrow() {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-2 shrink-0"
      variants={{ rest: { x: 0 }, hover: { x: 4 } }}
      transition={roll}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </motion.svg>
  );
}

type Props = { children: string; className?: string; arrow?: boolean } & (
  | ({ href: string } & Omit<HTMLMotionProps<"a">, "children">)
  | ({ href?: undefined } & Omit<HTMLMotionProps<"button">, "children">)
);

/** Primary button (Figma "button", type=Primary). Renders a link when given `href`. */
export function Button({ children, className = "", arrow = false, ...rest }: Props) {
  const anim = { initial: "rest", animate: "rest", whileHover: "hover", whileFocus: "hover" } as const;
  if (rest.href !== undefined) {
    return (
      <motion.a className={`${base} ${className}`} {...anim} {...(rest as HTMLMotionProps<"a">)}>
        <RollingText text={children} />
        {arrow && <Arrow />}
      </motion.a>
    );
  }
  return (
    <motion.button type="button" className={`${base} ${className}`} {...anim} {...(rest as HTMLMotionProps<"button">)}>
      <RollingText text={children} />
      {arrow && <Arrow />}
    </motion.button>
  );
}

/**
 * "Pill" — icon + category label on case studies. The icon is an SVG used as a
 * mask so it takes the text colour; it is decorative (the label says it all).
 */
export function Pill({ icon, label, size = "sm" }: { icon: string; label: string; size?: "sm" | "md" }) {
  // Small SVGs are inlined as data URIs (which contain parentheses), so the url() must be quoted.
  const mask = `url("${icon.replace(/"/g, "%22")}")`;
  return (
    <p className={`${size === "md" ? "body-md" : "body-sm"} font-pill inline-flex items-center gap-2 font-bold! text-text-primary whitespace-nowrap`}>
      <span
        aria-hidden="true"
        className="size-6 shrink-0 bg-current"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
      <span>{label}</span>
    </p>
  );
}
