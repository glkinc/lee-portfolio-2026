import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import {
  FILLS,
  SHAPES,
  SHAPE_NAMES,
  tileColor,
  type ShapeName,
  type TileSpec,
} from "./shapes";
import { useTileTheme } from "./TileTheme";

export interface BauhausTileProps extends TileSpec {
  /**
   * Change this value to (re)play the "Bauhaus glitch": the tile starts
   * blank, swaps through 3 random shapes, then lands on its designed state.
   * Any tile given a glitchKey (even 0) stays blank until its first glitch.
   * `undefined` = tile never glitches.
   */
  glitchKey?: number;
  /** Base glitch length in ms (each tile adds a little jitter so they land in a ripple). */
  glitchDuration?: number;
  /**
   * "Sketch to build" entrance (hero): the tile starts as a dashed wireframe,
   * becomes a grey outline, then a coloured outline, then the solid tile.
   * `key` 0 holds (or returns to) the wireframe, so it is in the prerendered
   * HTML; any other value plays the build after `delay` ms. Takes precedence
   * over `glitchKey`.
   */
  build?: {
    key: number;
    delay: number;
    /**
     * "Shine": from the solid tile, play the build backwards to the dashed
     * wireframe and straight forward again to solid. `key` still triggers it.
     */
    rewind?: boolean;
    /** ms per stage (default BUILD_STEP_MS). */
    step?: number;
  };
  /** Ignore the hero swatch colour override (used by the logo). */
  ignoreTheme?: boolean;
  className?: string;
  style?: CSSProperties;
}

type Frame = Required<Pick<TileSpec, "shape" | "fill" | "bg">>;

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** Glitch frames are shapes only — no tile background fill. */
function randomFrame(avoid: ShapeName[]): Frame {
  const shape = pick(SHAPE_NAMES.filter((s) => !avoid.includes(s)));
  return { shape, fill: pick(FILLS), bg: "none" };
}

const GLITCH_STEPS = 3;

/** Build stages: 0 dashed wireframe → 1 grey outline → 2 coloured outline → 3 solid. */
type BuildStage = 0 | 1 | 2 | 3;
const BUILD_STEP_MS = 320;

/**
 * The "Bauhaus Tile" component — an 80×80 vector tile made of a shape, a
 * shape fill and a tile background, rotatable in 90° steps. Colours come from
 * the Tile Fill / Tile Background tokens. Purely decorative, so it is hidden
 * from assistive tech.
 */
function BauhausTileBase({
  shape,
  fill,
  bg = "none",
  rotate = 0,
  flip = false,
  glitchKey,
  glitchDuration = 2400,
  build,
  ignoreTheme = false,
  className,
  style,
}: BauhausTileProps) {
  const { accent } = useTileTheme();
  const reduceMotion = useReducedMotion();
  const [frame, setFrame] = useState<Frame | null>(null);
  const glitches = glitchKey !== undefined;
  const [empty, setEmpty] = useState(glitches);
  // While glitching (and on the landing frame) changes swap instantly — no colour fade.
  const [instant, setInstant] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const [stage, setStage] = useState<BuildStage>(build ? 0 : 3);

  const buildKey = build?.key;
  const buildDelay = build?.delay ?? 0;
  const buildRewind = !!build?.rewind;
  const buildStep = build?.step ?? BUILD_STEP_MS;
  useEffect(() => {
    if (buildKey === undefined) return;
    if (reduceMotion) {
      setStage(3);
      return;
    }
    if (!buildKey) {
      setStage(0);
      return;
    }
    const stages: BuildStage[] = buildRewind ? [2, 1, 0, 1, 2, 3] : [1, 2, 3];
    const timers = stages.map((s, i) =>
      window.setTimeout(() => setStage(s), buildDelay + i * buildStep),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [buildKey, buildDelay, buildRewind, buildStep, reduceMotion]);

  // Reduced motion: no glitch, just show the designed tile.
  useEffect(() => {
    if (reduceMotion) setEmpty(false);
  }, [reduceMotion]);

  useEffect(() => {
    if (!glitchKey || reduceMotion || build) return;
    // Blank → 3 different shapes → snap to the designed tile.
    const interval = glitchDuration / (GLITCH_STEPS + 1);
    const seen: ShapeName[] = [shape];
    let step = 0;
    let restore: number | undefined;
    const tick = () => {
      if (step++ >= GLITCH_STEPS) {
        setFrame(null);
        restore = window.setTimeout(() => setInstant(false), 60);
        return;
      }
      const next = randomFrame(seen);
      seen.push(next.shape);
      setEmpty(false);
      setFrame(next);
      timer.current = window.setTimeout(tick, interval * (0.8 + Math.random() * 0.4));
    };
    setInstant(true);
    setEmpty(true);
    // Random start offset so the grid ripples instead of changing in lockstep.
    timer.current = window.setTimeout(tick, Math.random() * 300);
    return () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(restore);
      setFrame(null);
      setEmpty(false);
      setInstant(false);
    };
    // `shape` is read once per glitch on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchKey, glitchDuration, reduceMotion]);

  const themed = accent && !ignoreTheme;
  const current = frame ?? { shape, fill, bg };
  const shapeFill = themed ? accent : current.fill;
  const tileBg = themed ? "none" : current.bg;

  if (build) {
    return (
      <svg
        viewBox="0 0 80 80"
        aria-hidden="true"
        focusable="false"
        data-stage={stage}
        className={`bauhaus-tile tile-build block size-full overflow-visible ${className ?? ""}`}
        style={{
          transform: `rotate(${rotate}deg)${flip ? " scaleY(-1)" : ""}`,
          ["--tb-color" as string]: tileColor(shapeFill),
          ...style,
        }}
      >
        <rect className="tb-bg" width="80" height="80" style={{ fill: tileColor(tileBg) }} />
        <rect className="tb-cell" width="80" height="80" vectorEffect="non-scaling-stroke" />
        <path className="tb-shape" d={SHAPES[shape]} vectorEffect="non-scaling-stroke" style={{ fill: tileColor(shapeFill) }} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden="true"
      focusable="false"
      className={`bauhaus-tile block size-full overflow-visible ${instant ? "bauhaus-tile--instant" : ""} ${className ?? ""}`}
      style={{
        transform: `rotate(${rotate}deg)${flip ? " scaleY(-1)" : ""}`,
        ...style,
      }}
    >
      {!empty && (
        <>
          <rect width="80" height="80" style={{ fill: tileColor(tileBg) }} />
          <path d={SHAPES[current.shape]} style={{ fill: tileColor(shapeFill) }} />
        </>
      )}
    </svg>
  );
}

export const BauhausTile = memo(BauhausTileBase);
