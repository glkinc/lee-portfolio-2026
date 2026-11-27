import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { TileCluster } from "../bauhaus/TileCluster";
import { useBuildOnView } from "../bauhaus/BuildOnView";
import type { PlacedTile } from "../bauhaus/shapes";
import { footerTiles } from "../../data/tiles";
import { site } from "../../data/site";
import linkedinIcon from "../../assets/icons/linkedin.svg";
import mediumIcon from "../../assets/icons/medium.svg";
import dribbbleIcon from "../../assets/icons/dribbble.svg";
import glkFace from "../../assets/logos/glk-face.svg";

const socials = [
  { href: site.social.linkedin, label: "Lee Travaglini on LinkedIn", icon: linkedinIcon, size: 36 },
  { href: site.social.medium, label: "Lee Travaglini on Medium", icon: mediumIcon, size: 48 },
  { href: site.social.dribbble, label: "Lee Travaglini on Dribbble", icon: dribbbleIcon, size: 48 },
];

/**
 * "Sketch to build" timing for the plant, bottom-up: each row starts after the
 * one below it, the left tile a beat ahead of the right.
 */
const ROW_STAGGER_MS = 200;
const COL_STAGGER_MS = 90;
const plantRows = Math.max(...footerTiles.map((t) => t.row)) + 1;
const buildDelay = ({ col, row }: PlacedTile) => (plantRows - 1 - row) * ROW_STAGGER_MS + col * COL_STAGGER_MS;

/**
 * Contact / footer. The leaf "plant" builds from wireframe to solid tiles,
 * bottom row first, once it's on screen; it drops back to the wireframe when
 * you leave so it rebuilds on return. Grey, with a faint tile grid behind it.
 */
export function Contact() {
  const plantRef = useRef<HTMLDivElement>(null);
  // Builds each time the plant comes into view; back to the wireframe once it's fully off screen.
  const buildKey = useBuildOnView(plantRef);
  // Year is rendered at build time; refresh on the client so it's always current.
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer id="contact" aria-labelledby="contact-title" className="isolate overflow-clip bg-bg-subtle">
      <div className="tile-grid mx-auto flex w-full max-w-[1328px] flex-col gap-12 px-6 pt-12 pb-6 lg:pt-20 lg:pb-12">
        {/* Heading + email, socials, and the plant. Phones: socials sit beside the plant. */}
        <div className="relative grid grid-cols-[1fr_auto] gap-x-6 gap-y-6 [--footer-tile:51px] lg:min-h-[calc(var(--tile)*4)] lg:grid-rows-[1fr_auto] lg:[--footer-tile:var(--tile)]">
          {/* Faint tile grid behind the footer, one line per plant tile, lined up with the plant. Positioned from this box but
              layered in the footer's stacking context (`isolate` on <footer>), so it sits behind all footer content. */}
          <div aria-hidden="true" className="footer-grid-lines pointer-events-none absolute -z-10" />

          <div className="col-span-2 flex flex-col gap-6 lg:col-span-1 lg:row-start-1">
            <div className="flex flex-col gap-4">
              <h2 id="contact-title" className="heading-xs text-text-accent">
                Contact
              </h2>
              <p className="heading-lg max-w-[607px]">
                Have an idea?
                <br />
                I’d love to help build it.
              </p>
            </div>
            <Button href={`mailto:${site.email}`} arrow className="w-fit" aria-label={`Get in touch: email ${site.email}`}>
              Get in touch
            </Button>
          </div>

          <ul className="row-start-2 flex items-center gap-6 self-end" aria-label="Social profiles">
            {socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener me"
                  aria-label={s.label}
                  className="grid size-12 place-items-center rounded-full transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-6deg] motion-reduce:transform-none"
                >
                  <img src={s.icon} alt="" width={s.size} height={s.size} />
                </a>
              </li>
            ))}
          </ul>

          <div
            ref={plantRef}
            className="col-start-2 row-start-2 self-end lg:row-span-2 lg:row-start-1"
          >
            <TileCluster
              tiles={footerTiles}
              size="var(--footer-tile)"
              build={(t) => ({ key: buildKey, delay: buildDelay(t) })}
            />
          </div>
        </div>

        {/* Phones: studio line first, then copyright, centred. Desktop: copyright left, studio right. */}
        <div className="flex flex-col-reverse items-center gap-4 md:flex-row md:justify-between">
          <p className="body-md">
            <span suppressHydrationWarning>©{year}</span> {site.name}. All Rights Reserved.
          </p>
          <p className="body-md flex items-center gap-4">
            <img src={glkFace} alt="" width={42} height={48} className="h-12 w-auto" />
            <span>
              A member of{" "}
              <a
                href={site.studio.url}
                target="_blank"
                rel="noopener"
                className="font-bold underline-offset-4 hover:underline"
              >
                Good Lookin Kids inc.
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
