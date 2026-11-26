import type { CSSProperties } from "react";
import { motion, type MotionProps } from "motion/react";
import { BauhausTile } from "./BauhausTile";
import type { PlacedTile, TileSpec } from "./shapes";

interface TileClusterProps {
  tiles: PlacedTile[];
  /** Tile edge length, any CSS length. Defaults to the grid tile size. */
  size?: string;
  glitchKey?: number;
  glitchDuration?: number;
  ignoreTheme?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Per-tile motion props (entrances, growth, etc). */
  tileMotion?: (tile: PlacedTile, index: number) => MotionProps;
}

/**
 * Places Bauhaus tiles on a CSS grid by (col, row). The grid is sized from the
 * furthest tile so clusters stay compact and scale with `--tile`.
 */
export function TileCluster({
  tiles,
  size = "var(--tile, 80px)",
  glitchKey,
  glitchDuration,
  ignoreTheme,
  className,
  style,
  tileMotion,
}: TileClusterProps) {
  const cols = Math.max(...tiles.map((t) => t.col)) + 1;
  const rows = Math.max(...tiles.map((t) => t.row)) + 1;
  return (
    <div
      aria-hidden="true"
      className={`grid ${className ?? ""}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${size})`,
        gridTemplateRows: `repeat(${rows}, ${size})`,
        ...style,
      }}
    >
      {tiles.map((t, i) => {
        const { col, row, ...spec } = t;
        const { style: motionStyle, ...motionProps } = tileMotion?.(t, i) ?? {};
        return (
          <motion.div
            key={`${col}-${row}`}
            {...motionProps}
            style={{ ...motionStyle, gridColumn: col + 1, gridRow: row + 1 }}
          >
            <BauhausTile
              {...spec}
              glitchKey={glitchKey}
              glitchDuration={glitchDuration}
              ignoreTheme={ignoreTheme}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

interface TileBandProps {
  tiles: TileSpec[];
  /** Smaller tiles: 8 across on phones, 12 from tablet up (pass 12 tiles). */
  dense?: boolean;
  glitchKey?: number;
  className?: string;
  tileMotion?: (tile: TileSpec, index: number) => MotionProps;
}

/** A single fluid row of square tiles (used by the mobile layouts). */
export function TileBand({ tiles, dense = false, glitchKey, className, tileMotion }: TileBandProps) {
  return (
    <div
      aria-hidden="true"
      className={`grid ${dense ? "grid-cols-8 md:grid-cols-12" : ""} ${className ?? ""}`}
      style={dense ? undefined : { gridTemplateColumns: `repeat(${tiles.length}, minmax(0, 1fr))` }}
    >
      {tiles.map((t, i) => (
        <motion.div
          key={i}
          className={`aspect-square ${dense && i >= 8 ? "hidden md:block" : ""}`}
          {...tileMotion?.(t, i)}
        >
          <BauhausTile {...t} glitchKey={glitchKey} />
        </motion.div>
      ))}
    </div>
  );
}
