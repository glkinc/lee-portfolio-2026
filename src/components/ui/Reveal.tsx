import { motion, useReducedMotion } from "motion/react";
import { Fragment, type ElementType, type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Mask split text: each word sits in an overflow-hidden mask and slides up
 * into place, staggered. Text stays real, selectable and indexable.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.08,
  id,
  stackOnLarge = false,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  id?: string;
  /** Put each word on its own line from the lg breakpoint up. */
  stackOnLarge?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <Tag className={className} id={id}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className={`${stackOnLarge ? "inline-block lg:block" : "inline-block"} overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom`}>
            <motion.span
              className="reveal inline-block"
              initial={reduce ? false : { y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, ease, delay: delay + i * stagger }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Content that slides into view from a masked container. */
export function MaskSlide({
  children,
  delay = 0,
  from = "up",
  className,
}: {
  children: ReactNode;
  delay?: number;
  from?: "up" | "left";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const hidden = from === "up" ? { y: "105%" } : { x: "-105%" };
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="reveal"
        initial={reduce ? false : hidden}
        animate={{ x: 0, y: 0 }}
        transition={{ duration: 1, ease, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
