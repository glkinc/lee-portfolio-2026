import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { TileCluster } from "../bauhaus/TileCluster";
import { logoTiles } from "../../data/tiles";
import { scrollToElement } from "../../lib/scrollToElement";

/** Hover "shine": ms per build stage, and the delay between diagonals. */
const SHINE_STEP = 130;
const SHINE_STAGGER = 70;

/**
 * The 2 × 2 leaf mark in a white pill, top-left. It appears once the hero has
 * mostly scrolled away, sketching itself in (wireframe → solid) like the rest
 * of the tiles, and takes you back to the top when clicked.
 *
 * Hover / keyboard focus: a "shine" — the build plays backwards to the dashed
 * wireframe and forward again to solid, sweeping corner to corner.
 */
export function ScrollLogo() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const [build, setBuild] = useState({ key: 0, rewind: false });

  useMotionValueEvent(scrollY, "change", (y) => {
    const hero = document.getElementById("top");
    setShow(y > (hero ? hero.offsetHeight * 0.6 : 400));
  });
  // A fresh build each time it appears; back to the wireframe once hidden.
  useEffect(() => setBuild((b) => ({ key: show ? b.key + 1 : 0, rewind: false })), [show]);

  const shine = () => {
    if (show && !reduce) setBuild((b) => ({ key: b.key + 1, rewind: true }));
  };

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      inert={!show}
      onClick={() => {
        const top = document.getElementById("top");
        if (top) scrollToElement(top, !!reduce);
        else window.scrollTo({ top: 0 });
      }}
      onPointerEnter={shine}
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && shine()}
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6, y: show ? 0 : -12 }}
      whileTap={reduce ? undefined : { scale: 0.92 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: show ? "auto" : "none" }}
      className="rounded-full bg-bg-page p-2 shadow-nav [--logo-tile:16px] md:[--logo-tile:24px]"
    >
      <TileCluster
        tiles={logoTiles}
        size="var(--logo-tile)"
        ignoreTheme
        className="build-shape-only"
        build={(t) =>
          build.rewind
            ? { key: build.key, delay: (t.col + t.row) * SHINE_STAGGER, rewind: true, step: SHINE_STEP }
            : { key: build.key, delay: (t.col + t.row) * 90 }
        }
      />
    </motion.button>
  );
}
