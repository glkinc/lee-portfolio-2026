import { useInView } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { TileCluster } from "./TileCluster";
import type { PlacedTile } from "./shapes";

/**
 * Build key for the "sketch to build" entrance (see BauhausTile `build`):
 * a new non-zero key each time `ref` comes into view (by `amount`), and 0 —
 * back to the wireframe — once it has left the screen entirely, so it
 * rebuilds on return without snapping back while still partly visible.
 */
export function useBuildOnView(ref: RefObject<Element | null>, amount = 0.6) {
  const entered = useInView(ref, { amount });
  const visible = useInView(ref);
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (entered) setKey((k) => k + 1);
  }, [entered]);
  useEffect(() => {
    if (!visible) setKey(0);
  }, [visible]);
  return key;
}

interface BuildOnViewProps {
  tiles: PlacedTile[];
  /** Tile edge length, any CSS length (defaults to the grid tile size). */
  size?: string;
  /** "down" builds the top row first, "up" the bottom row first. */
  direction?: "down" | "up";
  /** Delay between rows, and between tiles along a row, in ms. */
  rowStagger?: number;
  colStagger?: number;
  /** How much of the cluster must be on screen before it builds (0–1). */
  amount?: number;
  className?: string;
}

/**
 * A tile cluster that builds from dashed wireframe to solid tiles, row by
 * row, when it scrolls into view. Only the shape is sketched (no tile
 * square), unlike the hero and footer.
 */
export function BuildOnView({
  tiles,
  size,
  direction = "down",
  rowStagger = 200,
  colStagger = 90,
  amount,
  className,
}: BuildOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const key = useBuildOnView(ref, amount);
  const lastRow = Math.max(...tiles.map((t) => t.row));
  const delay = ({ col, row }: PlacedTile) =>
    (direction === "down" ? row : lastRow - row) * rowStagger + col * colStagger;

  return (
    <div ref={ref} className={`build-shape-only ${className ?? ""}`}>
      <TileCluster tiles={tiles} size={size} build={(t) => ({ key, delay: delay(t) })} />
    </div>
  );
}
