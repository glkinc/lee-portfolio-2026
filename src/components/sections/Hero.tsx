import { BauhausTile } from "../bauhaus/BauhausTile";
import { TileCluster } from "../bauhaus/TileCluster";
import { useGlitchOnMount } from "../bauhaus/useGlitchOnView";
import type { PlacedTile } from "../bauhaus/shapes";
import { MaskSlide, SplitText } from "../ui/Reveal";
import { Swatches } from "../ui/Swatches";
import { heroTiles } from "../../data/tiles";
import { site } from "../../data/site";

// Mobile shows only the top band (rows 0–1).
const heroTopBand = heroTiles.filter((t) => t.row < 2);

/**
 * "Sketch to build" timing: each band sweeps diagonally from its top-left tile
 * to its bottom-right one; the lower band (rows 7–9) follows a beat behind.
 */
const BUILD_STAGGER_MS = 90;
const LOWER_BAND_LAG_MS = 280;
const buildDelay = ({ col, row }: PlacedTile) => {
  const lower = row >= 7;
  return (col + (lower ? row - 7 : row)) * BUILD_STAGGER_MS + (lower ? LOWER_BAND_LAG_MS : 0);
};

/**
 * Hero. Desktop (≥1024) is the 16 × 10 tile grid from Figma, capped so its height never exceeds the viewport (the bottom tiles stay on screen): a tile band above
 * and below the name. Below that it's the mobile layout with the top band, name,
 * intro and swatches stacked. One DOM serves both so the heading and copy are
 * never duplicated.
 */
export function Hero() {
  // Fires once shortly after mount; the tiles hold their wireframe until then.
  const buildKey = useGlitchOnMount(250);
  const build = (t: PlacedTile) => ({ key: buildKey, delay: buildDelay(t) });

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="tile-grid relative isolate mx-auto w-full max-w-[1328px] [--hero-m-tile:min(80px,calc((100cqw-56px)/6))] lg:px-6 lg:py-12"
    >
      <div className="flex flex-col gap-6 px-6 pb-6 lg:relative lg:isolate lg:mx-auto lg:grid lg:w-full lg:max-w-[max(720px,calc((100svh-6rem)*1.6))] lg:[container-type:inline-size] lg:aspect-[8/5] lg:grid-cols-16 lg:grid-rows-10 lg:gap-0 lg:p-0">
        {/* Mobile / tablet: the same faint grid, one line per top-band tile, starting at the band's top-left corner. */}
        <div aria-hidden="true" className="hero-grid-lines-mobile pointer-events-none absolute inset-0 -z-10 lg:hidden" />

        {/* Desktop: faint grid lines on the tile grid, carried out to the page edges and into the section padding. */}
        <div aria-hidden="true" className="hero-grid-lines pointer-events-none absolute -z-10 hidden lg:block" />

        {/* Desktop: both bands on the grid. */}
        {heroTiles.map((tile) => {
          const { col, row, ...spec } = tile;
          return (
            <div
              key={`${col}-${row}`}
              aria-hidden="true"
              className="hidden lg:block"
              style={{ gridColumn: col + 1, gridRow: row + 1 }}
            >
              <BauhausTile {...spec} build={build(tile)} />
            </div>
          );
        })}

        {/* Mobile / tablet: top band, 6 tiles wide. */}
        <TileCluster
          tiles={heroTopBand}
          size="var(--hero-m-tile)"
          build={build}
          className="lg:hidden"
        />

        <div className="flex flex-col gap-1 lg:[--body-xl-lh:2.8cqw] lg:[--body-xl-size:1.875cqw] lg:[--heading-xl-lh:7.5cqw] lg:[--heading-xl-size:7.5cqw] lg:col-span-7 lg:col-start-1 lg:row-span-4 lg:row-start-4 lg:justify-center">
          <h1 id="hero-title" className="heading-xl text-text-primary">
            <SplitText text={site.name} delay={0.2} stagger={0.12} stackOnLarge />
            {/* Visually part of the title block, but kept in the h1 for SEO context. */}
            <span className="sr-only"> — product designer and creative generalist</span>
          </h1>
          <MaskSlide delay={0.55}>
            <p className="body-xl text-text-primary">{site.tagline}</p>
          </MaskSlide>
        </div>

        <MaskSlide delay={0.75} className="lg:[--body-md-lh:max(20px,1.875cqw)] lg:[--body-md-size:max(13px,1.25cqw)] lg:col-span-6 lg:col-start-9 lg:row-span-2 lg:row-start-6">
          <p className="body-md text-text-primary">{site.intro}</p>
        </MaskSlide>

        </div>

      {/* Pinned to the section's bottom-right (outside the grid). Scales down with the page but never below a 44px tap target. */}
      <Swatches className="flex gap-1 px-6 pb-6 lg:absolute lg:right-6 lg:bottom-12 lg:flex-col lg:items-center lg:p-0 lg:[--swatch:clamp(44px,4.4cqw,56px)]" />
    </section>
  );
}
