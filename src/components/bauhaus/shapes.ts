/**
 * Bauhaus Tile shapes — path data taken from the Figma "Bauhaus Tile"
 * component set (node 2512:53). Every shape is drawn on an 80×80 canvas.
 * The original SVG exports live in src/assets/shapes/ for reference.
 */
export const SHAPES = {
  Quarter: "M0 80V0C21.2173 0 41.5656 8.42855 56.5685 23.4315C71.5715 38.4344 80 58.7827 80 80H0Z",
  Half: "M0 80C0 69.3913 4.21427 59.2172 11.7157 51.7157C19.2172 44.2143 29.3913 40 40 40C50.6087 40 60.7828 44.2143 68.2843 51.7157C75.7857 59.2172 80 69.3913 80 80H0Z",
  Circle:
    "M0 40C0 29.3913 4.21427 19.2172 11.7157 11.7157C19.2172 4.21427 29.3913 0 40 0C50.6087 0 60.7828 4.21427 68.2843 11.7157C75.7857 19.2172 80 29.3913 80 40C80 50.6087 75.7857 60.7828 68.2843 68.2843C60.7828 75.7857 50.6087 80 40 80C29.3913 80 19.2172 75.7857 11.7157 68.2843C4.21427 60.7828 0 50.6087 0 40Z",
  Dot: "M20 40C20 34.6957 22.1071 29.6086 25.8579 25.8579C29.6086 22.1071 34.6957 20 40 20C45.3043 20 50.3914 22.1071 54.1421 25.8579C57.8929 29.6086 60 34.6957 60 40C60 45.3043 57.8929 50.3914 54.1421 54.1421C50.3914 57.8929 45.3043 60 40 60C34.6957 60 29.6086 57.8929 25.8579 54.1421C22.1071 50.3914 20 45.3043 20 40Z",
  Square: "M0 0H80V80H0V0Z",
  Leaf: "M80 0C80 21.2173 71.5715 41.5656 56.5685 56.5685C41.5656 71.5715 21.2173 80 0 80C0 58.7827 8.42855 38.4344 23.4315 23.4315C38.4344 8.42855 58.7827 0 80 0Z",
  Ring: "M0 40C0 29.3913 4.21427 19.2172 11.7157 11.7157C19.2172 4.21427 29.3913 0 40 0C50.6087 0 60.7828 4.21427 68.2843 11.7157C75.7857 19.2172 80 29.3913 80 40C80 50.6087 75.7857 60.7828 68.2843 68.2843C60.7828 75.7857 50.6087 80 40 80C29.3913 80 19.2172 75.7857 11.7157 68.2843C4.21427 60.7828 0 50.6087 0 40ZM20 40C20 45.3043 22.1071 50.3914 25.8579 54.1421C29.6086 57.8929 34.6957 60 40 60C45.3043 60 50.3914 57.8929 54.1421 54.1421C57.8929 50.3914 60 45.3043 60 40C60 34.6957 57.8929 29.6086 54.1421 25.8579C50.3914 22.1071 45.3043 20 40 20C34.6957 20 29.6086 22.1071 25.8579 25.8579C22.1071 29.6086 20 34.6957 20 40Z",
  Stripes: "M0 0H80V8H0V0ZM0 16H80V24H0V16ZM0 32H80V40H0V32ZM0 48H80V56H0V48ZM0 64H80V72H0V64Z",
  Tab: "M0 0H40C50.6087 0 60.7828 4.21427 68.2843 11.7157C75.7857 19.2172 80 29.3913 80 40C80 50.6087 75.7857 60.7828 68.2843 68.2843C60.7828 75.7857 50.6087 80 40 80H0V0Z",
  Triangle: "M0 80V0L80 80H0Z",
} as const;

export type ShapeName = keyof typeof SHAPES;
export const SHAPE_NAMES = Object.keys(SHAPES) as ShapeName[];

/** "Tile Fill" collection modes. */
export type TileFill = "red" | "blue" | "yellow" | "dark" | "white";
/** "Tile Background" collection modes. */
export type TileBackground = "none" | TileFill;

export const FILLS: TileFill[] = ["red", "blue", "yellow", "dark", "white"];

/** Maps a tile colour mode to its design token. */
export const tileColor = (c: TileBackground) =>
  c === "none" ? "transparent" : `var(--color-tile-${c})`;

export type Rotation = 0 | 90 | 180 | -90 | -180 | 270;

export interface TileSpec {
  shape: ShapeName;
  fill: TileFill;
  bg?: TileBackground;
  /** Rotation in 90° steps (Figma instance rotation). */
  rotate?: Rotation;
  /** Vertical flip (Figma "flip vertical"). */
  flip?: boolean;
}

/** A tile placed on the 16-column tile grid (column/row are 0-based). */
export interface PlacedTile extends TileSpec {
  col: number;
  row: number;
}
