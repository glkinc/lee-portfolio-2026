import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { TileCluster } from "./TileCluster";
import type { PlacedTile } from "./shapes";

/** Stable pseudo-random 0–1 per cell, so server and client agree. */
const hash = (col: number, row: number) => {
  const x = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * A tile pattern that fades in as you scroll: tiles appear in a random order,
 * but the order is biased to run from the top row down. It is scroll-linked,
 * so scrolling back up fades them out again.
 *
 * One scroll listener writes a single progress variable (`--p`); each tile's
 * opacity is pure CSS from its own threshold (`--t`), so scrolling stays cheap.
 * Without JavaScript `--p` stays at its server value and every tile is visible.
 */
export function ScrollFadeTiles({
  tiles,
  size,
  className,
}: {
  tiles: PlacedTile[];
  size?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rows = Math.max(...tiles.map((t) => t.row)) + 1;

  // Progress: 0 as the pattern's top edge enters the lower part of the screen,
  // 1 once its bottom edge has climbed past the middle.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "end 55%"] });
  const apply = (v: number) => ref.current?.style.setProperty("--p", String(reduce ? 2 : Math.min(1, Math.max(0, v))));
  useMotionValueEvent(scrollYProgress, "change", apply);
  useEffect(() => apply(scrollYProgress.get()));

  const thresholds = useMemo(
    () => new Map(tiles.map((t) => [`${t.col}-${t.row}`, (t.row / rows) * 0.66 + hash(t.col, t.row) * 0.24])),
    [tiles, rows],
  );

  return (
    <div ref={ref} className={className} style={{ "--p": 2 } as CSSProperties}>
      <TileCluster
        tiles={tiles}
        size={size}
        tileMotion={(t) => ({
          style: {
            "--t": thresholds.get(`${t.col}-${t.row}`)!.toFixed(3),
            opacity: "clamp(0, calc((var(--p) - var(--t)) * 14), 1)",
          } as never,
        })}
      />
    </div>
  );
}
