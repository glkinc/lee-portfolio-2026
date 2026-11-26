import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { TileCluster } from "../bauhaus/TileCluster";
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

const grow = { type: "spring", stiffness: 190, damping: 17 } as const;

/**
 * Contact / footer. The leaf tiles grow upward like a plant once they're on
 * screen: always bottom row first, and cleared again when you leave so it
 * regrows from the bottom on return. Grey on desktop, white on phones.
 */
export function Contact() {
  const plantRef = useRef<HTMLDivElement>(null);
  // Not `once`: the plant is cleared when you leave and grows again, bottom row first, when you return.
  const inView = useInView(plantRef, { once: false, amount: 0.6 });
  const reduce = useReducedMotion();
  // Year is rendered at build time; refresh on the client so it's always current.
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);

  // Rows sprout from the bottom (row 3) up to the top (row 0).
  const sprout = (row: number, col: number) => {
    if (reduce) return {};
    const order = 3 - row;
    return {
      initial: { scale: 0, opacity: 0 },
      animate: inView
        ? { scale: 1, opacity: 1, transition: { ...grow, delay: 0.15 + order * 0.28 + col * 0.08 } }
        : { scale: 0, opacity: 0, transition: { duration: 0 } },
      style: { transformOrigin: col === 0 ? "100% 100%" : "0% 100%" },
    };
  };

  return (
    <footer id="contact" aria-labelledby="contact-title" className="bg-bg-page lg:bg-bg-subtle">
      <div className="tile-grid mx-auto flex w-full max-w-[1328px] flex-col gap-12 px-6 pt-12 pb-6 lg:pt-20 lg:pb-12">
        {/* Heading + email, socials, and the plant. Phones: socials sit beside the plant. */}
        <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-6 lg:min-h-[calc(var(--tile)*4)] lg:grid-rows-[1fr_auto]">
          <div className="col-span-2 flex flex-col gap-6 lg:col-span-1 lg:row-start-1">
            <h2 id="contact-title" className="heading-lg max-w-[607px]">
              Have an idea?
              <br />
              I’d love to help build it.
            </h2>
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
            className="col-start-2 row-start-2 self-end [--footer-tile:51px] lg:row-span-2 lg:row-start-1 lg:[--footer-tile:var(--tile)]"
          >
            <TileCluster tiles={footerTiles} size="var(--footer-tile)" tileMotion={(t) => sprout(t.row, t.col)} />
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
