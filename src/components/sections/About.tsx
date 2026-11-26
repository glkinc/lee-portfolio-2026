import { BuildOnView } from "../bauhaus/BuildOnView";
import { aboutBand, aboutTiles } from "../../data/tiles";

/**
 * About. Copy on the left; on the right a 6 × 10 pattern of quarter-circle
 * tiles that builds from wireframe to solid, top row first, when it comes into view.
 * On phones the pattern becomes an 8 × 2 band under the copy.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-bg-page lg:pt-20">
      <div className="tile-grid relative mx-auto w-full max-w-[1328px] lg:px-6">
        {/* Desktop pattern, right-aligned on the 16-column grid. */}
        <BuildOnView
          tiles={aboutTiles}
          rowStagger={110}
          colStagger={50}
          amount={0.25}
          className="absolute top-0 right-6 hidden lg:block"
        />

        <div className="flex flex-col gap-4 px-6 py-12 lg:ml-[calc(var(--tile)*2)] lg:min-h-[calc(var(--tile)*10)] lg:w-[calc(var(--tile)*6)] lg:px-0 lg:pt-[var(--tile)] lg:pb-0">
          <h2 id="about-title" className="heading-xs text-text-accent">
            About
          </h2>
          <p className="heading-sm">
            I'm Lee Travaglini, a Toronto designer who likes knowing how everything is made. Running a studio for over a decade
            taught me to learn by doing and to design with the build in mind.
          </p>
          <div className="body-md flex flex-col gap-6">
            <p>
              While running my own studio, I spent over ten years creating websites, brand identities, illustration and interactive
              installations. I've also designed and produced a board game and a children's activity deck, produced music
              videos, and taught UX and UI design at George Brown College and RED Academy.
            </p>
            <p>
              Having worked through several eras of web design, I bring solid design fundamentals and real front-end
              development experience to modern AI tools, which helps me explain clearly how a product should be designed
              and built. Away from the screen I'm usually building something else, like a working arcade cabinet, or out
              on a motorcycle or skateboard with music on. Wherever I am, I'm happiest when I'm making something.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile / tablet pattern: 8 × 2, full width. */}
      <div className="tile-grid lg:hidden">
        <BuildOnView tiles={aboutBand} size="calc(100cqw / 8)" colStagger={60} />
      </div>
    </section>
  );
}
