import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useState } from "react";
import { scrollToElement } from "../../lib/scrollToElement";

/** Round arrow button, bottom right. Appears once you've scrolled past the hero. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 400));

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      onClick={() => {
        const top = document.getElementById("top");
        if (top) scrollToElement(top, !!reduce);
        else window.scrollTo({ top: 0 });
      }}
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6, y: show ? 0 : 16 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: show ? "auto" : "none" }}
      className="fixed right-6 bottom-6 z-40 grid size-12 place-items-center rounded-full bg-bg-page text-text-primary shadow-nav transition-colors hover:bg-bg-dark hover:text-text-inverse"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </motion.button>
  );
}
