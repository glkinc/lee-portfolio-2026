import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { TileFill } from "./shapes";

/**
 * Easter-egg colour override driven by the hero swatches.
 * `null` = original design colours; otherwise every themed tile renders its
 * shape in that colour with no tile background.
 */
export type TileAccent = Extract<TileFill, "red" | "blue" | "yellow"> | null;

interface TileThemeValue {
  accent: TileAccent;
  setAccent: (accent: TileAccent) => void;
}

const TileThemeContext = createContext<TileThemeValue>({ accent: null, setAccent: () => {} });

export function TileThemeProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<TileAccent>(null);
  const value = useMemo(() => ({ accent, setAccent }), [accent]);
  return <TileThemeContext.Provider value={value}>{children}</TileThemeContext.Provider>;
}

export const useTileTheme = () => useContext(TileThemeContext);
