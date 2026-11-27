import type { PlacedTile } from "../components/bauhaus/shapes";

/**
 * Bauhaus tile layouts, read from the Figma file (shape variant, Tile Fill /
 * Tile Background modes, rotation, flip and grid cell of every instance).
 * `col`/`row` are 0-based cells on the 16-column grid (1 cell = 80px at 1280).
 */

/* ── Hero (desktop 16 × 10 grid) ────────────────────────────── */
/**
 * Two 6 × 3 bands: rows 0–2 sit above the name, rows 7–9 below it. On mobile
 * only the top two rows of the top band (rows 0–1) are shown.
 */
export const heroTiles: PlacedTile[] = [
  { col: 0, row: 0, shape: "Leaf", fill: "yellow" },
  { col: 1, row: 0, shape: "Quarter", fill: "dark", rotate: 180 },
  { col: 2, row: 0, shape: "Square", fill: "blue", bg: "dark", flip: true },
  { col: 3, row: 0, shape: "Circle", fill: "red", rotate: 180 },
  { col: 4, row: 0, shape: "Quarter", fill: "yellow" },
  { col: 5, row: 0, shape: "Quarter", fill: "red", flip: true },
  { col: 0, row: 1, shape: "Quarter", fill: "blue" },
  { col: 1, row: 1, shape: "Quarter", fill: "red", rotate: 180, flip: true },
  { col: 2, row: 1, shape: "Leaf", fill: "yellow", flip: true },
  { col: 3, row: 1, shape: "Quarter", fill: "blue", flip: true },
  { col: 4, row: 1, shape: "Quarter", fill: "dark", rotate: 180 },
  { col: 5, row: 1, shape: "Quarter", fill: "blue", flip: true },
  { col: 0, row: 2, shape: "Quarter", fill: "yellow" },
  { col: 1, row: 2, shape: "Quarter", fill: "red", flip: true },
  { col: 2, row: 2, shape: "Leaf", fill: "yellow" },
  { col: 3, row: 2, shape: "Quarter", fill: "dark", rotate: 180 },
  { col: 4, row: 2, shape: "Square", fill: "blue", bg: "dark", flip: true },
  { col: 5, row: 2, shape: "Circle", fill: "red", rotate: 180 },
  { col: 0, row: 7, shape: "Circle", fill: "red" },
  { col: 1, row: 7, shape: "Square", fill: "blue", bg: "dark", rotate: 180, flip: true },
  { col: 2, row: 7, shape: "Quarter", fill: "dark" },
  { col: 3, row: 7, shape: "Leaf", fill: "yellow", rotate: 180 },
  { col: 4, row: 7, shape: "Quarter", fill: "red", rotate: 180, flip: true },
  { col: 5, row: 7, shape: "Quarter", fill: "yellow", rotate: 180 },
  { col: 0, row: 8, shape: "Quarter", fill: "blue", rotate: 180, flip: true },
  { col: 1, row: 8, shape: "Quarter", fill: "dark" },
  { col: 2, row: 8, shape: "Quarter", fill: "blue", rotate: 180, flip: true },
  { col: 3, row: 8, shape: "Leaf", fill: "yellow", rotate: 180, flip: true },
  { col: 4, row: 8, shape: "Quarter", fill: "red", flip: true },
  { col: 5, row: 8, shape: "Quarter", fill: "blue", rotate: 180 },
  { col: 0, row: 9, shape: "Quarter", fill: "red", rotate: 180, flip: true },
  { col: 1, row: 9, shape: "Quarter", fill: "yellow", rotate: 180 },
  { col: 2, row: 9, shape: "Circle", fill: "red" },
  { col: 3, row: 9, shape: "Square", fill: "blue", bg: "dark", rotate: 180, flip: true },
  { col: 4, row: 9, shape: "Quarter", fill: "dark" },
  { col: 5, row: 9, shape: "Leaf", fill: "yellow", rotate: 180 },
];

/* ── Case studies heading cluster (2 × 2, left of the heading) ─ */
export const caseStudyTiles: PlacedTile[] = [
  { col: 0, row: 0, shape: "Triangle", fill: "red", rotate: 180, flip: true },
  { col: 1, row: 0, shape: "Triangle", fill: "yellow", rotate: 180, flip: true },
  { col: 0, row: 1, shape: "Triangle", fill: "blue", rotate: 180, flip: true },
  { col: 1, row: 1, shape: "Triangle", fill: "dark", rotate: 180, flip: true },
];

/* ── About ──────────────────────────────────────────────────── */
/** Right-hand pattern: 6 columns × 10 rows of quarter-circle tiles (desktop). */
export const aboutTiles: PlacedTile[] = [
  { col: 0, row: 0, shape: "Quarter", fill: "blue" },
  { col: 1, row: 0, shape: "Quarter", fill: "blue", rotate: 180, flip: true },
  { col: 2, row: 0, shape: "Quarter", fill: "blue", rotate: 90, flip: true },
  { col: 3, row: 0, shape: "Quarter", fill: "blue", rotate: 90 },
  { col: 4, row: 0, shape: "Quarter", fill: "blue" },
  { col: 5, row: 0, shape: "Quarter", fill: "blue", rotate: 180, flip: true },
  { col: 0, row: 1, shape: "Quarter", fill: "blue", flip: true },
  { col: 1, row: 1, shape: "Quarter", fill: "blue", rotate: 180 },
  { col: 2, row: 1, shape: "Quarter", fill: "blue", rotate: -90 },
  { col: 3, row: 1, shape: "Quarter", fill: "blue", rotate: -90, flip: true },
  { col: 4, row: 1, shape: "Quarter", fill: "blue", flip: true },
  { col: 5, row: 1, shape: "Quarter", fill: "blue", rotate: 180 },
  { col: 0, row: 2, shape: "Quarter", fill: "red", rotate: 90, flip: true },
  { col: 1, row: 2, shape: "Quarter", fill: "red", rotate: 90 },
  { col: 2, row: 2, shape: "Quarter", fill: "red" },
  { col: 3, row: 2, shape: "Quarter", fill: "red", rotate: 180, flip: true },
  { col: 4, row: 2, shape: "Quarter", fill: "red", rotate: 90, flip: true },
  { col: 5, row: 2, shape: "Quarter", fill: "red", rotate: 90 },
  { col: 0, row: 3, shape: "Quarter", fill: "red", rotate: -90 },
  { col: 1, row: 3, shape: "Quarter", fill: "red", rotate: -90, flip: true },
  { col: 2, row: 3, shape: "Quarter", fill: "red", flip: true },
  { col: 3, row: 3, shape: "Quarter", fill: "red", rotate: 180 },
  { col: 4, row: 3, shape: "Quarter", fill: "red", rotate: -90 },
  { col: 5, row: 3, shape: "Quarter", fill: "red", rotate: -90, flip: true },
  { col: 0, row: 4, shape: "Quarter", fill: "yellow" },
  { col: 1, row: 4, shape: "Quarter", fill: "yellow", rotate: 180, flip: true },
  { col: 2, row: 4, shape: "Quarter", fill: "yellow", rotate: 90, flip: true },
  { col: 3, row: 4, shape: "Quarter", fill: "yellow", rotate: 90 },
  { col: 4, row: 4, shape: "Quarter", fill: "yellow" },
  { col: 5, row: 4, shape: "Quarter", fill: "yellow", rotate: 180, flip: true },
  { col: 0, row: 5, shape: "Quarter", fill: "yellow", flip: true },
  { col: 1, row: 5, shape: "Quarter", fill: "yellow", rotate: 180 },
  { col: 2, row: 5, shape: "Quarter", fill: "yellow", rotate: -90 },
  { col: 3, row: 5, shape: "Quarter", fill: "yellow", rotate: -90, flip: true },
  { col: 4, row: 5, shape: "Quarter", fill: "yellow", flip: true },
  { col: 5, row: 5, shape: "Quarter", fill: "yellow", rotate: 180 },
  { col: 0, row: 6, shape: "Quarter", fill: "dark", rotate: 90, flip: true },
  { col: 1, row: 6, shape: "Quarter", fill: "dark", rotate: 90 },
  { col: 2, row: 6, shape: "Quarter", fill: "dark" },
  { col: 3, row: 6, shape: "Quarter", fill: "dark", rotate: 180, flip: true },
  { col: 4, row: 6, shape: "Quarter", fill: "dark", rotate: 90, flip: true },
  { col: 5, row: 6, shape: "Quarter", fill: "dark", rotate: 90 },
  { col: 0, row: 7, shape: "Quarter", fill: "dark", rotate: -90 },
  { col: 1, row: 7, shape: "Quarter", fill: "dark", rotate: -90, flip: true },
  { col: 2, row: 7, shape: "Quarter", fill: "dark", flip: true },
  { col: 3, row: 7, shape: "Quarter", fill: "dark", rotate: 180 },
  { col: 4, row: 7, shape: "Quarter", fill: "dark", rotate: -90 },
  { col: 5, row: 7, shape: "Quarter", fill: "dark", rotate: -90, flip: true },
  { col: 0, row: 8, shape: "Quarter", fill: "blue" },
  { col: 1, row: 8, shape: "Quarter", fill: "blue", rotate: 180, flip: true },
  { col: 2, row: 8, shape: "Quarter", fill: "blue", rotate: 90, flip: true },
  { col: 3, row: 8, shape: "Quarter", fill: "blue", rotate: 90 },
  { col: 4, row: 8, shape: "Quarter", fill: "blue" },
  { col: 5, row: 8, shape: "Quarter", fill: "blue", rotate: 180, flip: true },
  { col: 0, row: 9, shape: "Quarter", fill: "blue", flip: true },
  { col: 1, row: 9, shape: "Quarter", fill: "blue", rotate: 180 },
  { col: 2, row: 9, shape: "Quarter", fill: "blue", rotate: -90 },
  { col: 3, row: 9, shape: "Quarter", fill: "blue", rotate: -90, flip: true },
  { col: 4, row: 9, shape: "Quarter", fill: "blue", flip: true },
  { col: 5, row: 9, shape: "Quarter", fill: "blue", rotate: 180 },
];
/** Mobile pattern under the About copy: 8 columns × 2 rows. */
export const aboutBand: PlacedTile[] = [
  { col: 0, row: 0, shape: "Quarter", fill: "blue" },
  { col: 1, row: 0, shape: "Quarter", fill: "blue", rotate: 180, flip: true },
  { col: 2, row: 0, shape: "Quarter", fill: "red", rotate: 90, flip: true },
  { col: 3, row: 0, shape: "Quarter", fill: "red", rotate: 90 },
  { col: 4, row: 0, shape: "Quarter", fill: "yellow" },
  { col: 5, row: 0, shape: "Quarter", fill: "yellow", rotate: 180, flip: true },
  { col: 6, row: 0, shape: "Quarter", fill: "dark", rotate: 90, flip: true },
  { col: 7, row: 0, shape: "Quarter", fill: "dark", rotate: 90 },
  { col: 0, row: 1, shape: "Quarter", fill: "blue", flip: true },
  { col: 1, row: 1, shape: "Quarter", fill: "blue", rotate: 180 },
  { col: 2, row: 1, shape: "Quarter", fill: "red", rotate: -90 },
  { col: 3, row: 1, shape: "Quarter", fill: "red", rotate: -90, flip: true },
  { col: 4, row: 1, shape: "Quarter", fill: "yellow", flip: true },
  { col: 5, row: 1, shape: "Quarter", fill: "yellow", rotate: 180 },
  { col: 6, row: 1, shape: "Quarter", fill: "dark", rotate: -90 },
  { col: 7, row: 1, shape: "Quarter", fill: "dark", rotate: -90, flip: true },
];

/* ── Experience (2 × 2, beside the heading) ────────────────── */
export const experienceTiles: PlacedTile[] = [
  { col: 0, row: 0, shape: "Quarter", fill: "dark" },
  { col: 1, row: 0, shape: "Ring", fill: "red" },
  { col: 0, row: 1, shape: "Quarter", fill: "blue", rotate: 180 },
  { col: 1, row: 1, shape: "Leaf", fill: "yellow" },
];

/* ── Contact / footer — the "plant" (2 × 4, grows upward) ──── */
export const footerTiles: PlacedTile[] = [
  { col: 0, row: 0, shape: "Leaf", fill: "yellow", rotate: 180, flip: true },
  { col: 1, row: 0, shape: "Leaf", fill: "red", rotate: 180 },
  { col: 0, row: 1, shape: "Leaf", fill: "blue", rotate: 180, flip: true },
  { col: 1, row: 1, shape: "Leaf", fill: "dark", rotate: 180 },
  { col: 0, row: 2, shape: "Leaf", fill: "red", rotate: 180, flip: true },
  { col: 1, row: 2, shape: "Leaf", fill: "yellow", rotate: 180 },
  { col: 0, row: 3, shape: "Leaf", fill: "dark", rotate: 180, flip: true },
  { col: 1, row: 3, shape: "Leaf", fill: "blue", rotate: 180 },
];

/* ── Mobile menu (2 × 2 leaves, bottom-right) ──────────────── */
export const menuTiles: PlacedTile[] = [
  { col: 0, row: 0, shape: "Leaf", fill: "red" },
  { col: 1, row: 0, shape: "Leaf", fill: "yellow", rotate: 180, flip: true },
  { col: 0, row: 1, shape: "Leaf", fill: "blue", rotate: 180, flip: true },
  { col: 1, row: 1, shape: "Leaf", fill: "white", rotate: 180 },
];

/* ── Scroll logo (2 × 2 leaves — the four-point mark) ──────── */
export const logoTiles: PlacedTile[] = [
  { col: 0, row: 0, shape: "Leaf", fill: "red" },
  { col: 1, row: 0, shape: "Leaf", fill: "yellow", rotate: 180, flip: true },
  { col: 0, row: 1, shape: "Leaf", fill: "blue", rotate: 180, flip: true },
  { col: 1, row: 1, shape: "Leaf", fill: "dark", rotate: 180 },
];
