import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { MenuButton } from "../ui/MenuButton";
import { ScrollLogo } from "./ScrollLogo";
import { TileCluster } from "../bauhaus/TileCluster";
import { menuTiles } from "../../data/tiles";
import { sections, site, type SectionId } from "../../data/site";
import { lockScroll, unlockScroll } from "../../lib/scrollLock";
import { withBase } from "../../lib/base";

// Resolved token values (colour/blue/500 etc.) — Motion can only tween real
// colours, not var() references, and the pill blends between them.
const TOKENS = { blue500: "#006ad3", red500: "#df2c25", yellow500: "#ecb320", grey900: "#171717", grey0: "#ffffff" };
const accentStyles: Record<string, { bg: string; fg: string }> = {
  blue: { bg: TOKENS.blue500, fg: TOKENS.grey0 },
  red: { bg: TOKENS.red500, fg: TOKENS.grey0 },
  yellow: { bg: TOKENS.yellow500, fg: TOKENS.grey900 },
  dark: { bg: TOKENS.grey900, fg: TOKENS.grey0 },
};

const pillSpring = { type: "spring", stiffness: 520, damping: 38, mass: 0.7 } as const;

interface HeaderProps {
  active: SectionId | null;
  onNavigate: (id: SectionId) => void;
}

/**
 * Floating navigation: no bar — a white pill with a soft drop shadow
 * on desktop/tablet and a round menu button on phones. It sits at the hero's
 * top margin and eases up toward the edge once you scroll. The logo pill
 * (ScrollLogo) joins it on the left once the hero has scrolled away.
 */
export function Header({ active, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Pill position: hover previews, a click pins it until the scroll arrives,
  // otherwise it follows the section in view.
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const [pinned, setPinned] = useState<SectionId | null>(null);
  const shown = hovered ?? pinned ?? active;

  useEffect(() => {
    if (!pinned) return;
    if (active === pinned) {
      setPinned(null);
      return;
    }
    const t = window.setTimeout(() => setPinned(null), 2500);
    return () => window.clearTimeout(t);
  }, [pinned, active]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  // From 48px (aligned with the hero tiles) down to 16px once scrolled.
  const { scrollY } = useScroll();
  const navTop = useTransform(scrollY, [0, 120], ["48px", "16px"]);

  // Lock page + make it inert while the mobile menu is open; Esc closes.
  useEffect(() => {
    if (!menuOpen) return;
    const main = document.getElementById("main");
    const footer = document.getElementById("contact");
    lockScroll();
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Close the mobile menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(width >= 768px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = (e: MouseEvent, id: SectionId) => {
    e.preventDefault();
    setMenuOpen(false);
    setPinned(id);
    setHovered(null);
    onNavigate(id);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <motion.div
        className="mx-auto flex w-full max-w-[1328px] items-center justify-between px-4 pt-4 md:px-6 md:pt-(--nav-top)"
        style={{ "--nav-top": navTop } as never}
      >
        {/* Logo: appears once the hero scrolls away; takes you back to the top. */}
        <ScrollLogo />

        {/* Desktop / tablet navigation */}
        <nav aria-label="Primary" className="pointer-events-auto hidden md:block">
          <ul
            className="flex items-center gap-2 rounded-full bg-bg-page p-1 shadow-nav"
            onMouseLeave={() => setHovered(null)}
          >
            {sections.map((s) => {
              const isShown = shown === s.id;
              const isActive = active === s.id;
              const style = accentStyles[s.accent];
              return (
                <li key={s.id} className="relative">
                  {isShown && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full"
                      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1, backgroundColor: style.bg }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={pillSpring}
                    />
                  )}
                  <motion.a
                    href={withBase(`/#${s.id}`)}
                    onClick={(e) => go(e, s.id)}
                    onMouseEnter={() => setHovered(s.id)}
                    onFocus={() => setHovered(s.id)}
                    onBlur={() => setHovered(null)}
                    aria-current={isActive ? "location" : undefined}
                    className="label-md relative block rounded-full px-4 py-2 whitespace-nowrap"
                    animate={{ color: isShown ? style.fg : TOKENS.grey900 }}
                    transition={{ duration: 0.25 }}
                  >
                    {s.label}
                  </motion.a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile menu button */}
        <div className="pointer-events-auto md:hidden">
          <MenuButton ref={buttonRef} open={menuOpen} onToggle={() => setMenuOpen((o) => !o)} controls="mobile-menu" />
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            className="pointer-events-auto fixed inset-0 z-10 flex flex-col justify-between overflow-y-auto bg-bg-dark pb-6 text-text-inverse md:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 48px) 40px)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "circle(150% at calc(100% - 48px) 40px)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 48px) 40px)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <p className="heading-md flex h-20 items-center px-6">{site.name}</p>

            <nav aria-label="Mobile" className="px-6">
              <ul>
                {sections.map((s, i) => (
                  <motion.li
                    key={s.id}
                    className="border-b border-text-inverse"
                    initial={{ opacity: 0, x: reduce ? 0 : -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a href={withBase(`/#${s.id}`)} onClick={(e) => go(e, s.id)} className="group flex items-center gap-4 py-4">
                      <span className="body-sm w-6" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="heading-lg transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">
                        {s.menuLabel}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="flex items-center justify-between px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex flex-col gap-1">
                <p className="body-sm">{site.location}</p>
                <a
                  href={`mailto:${site.email}`}
                  target="_blank"
                  rel="noopener"
                  className="label-md underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>
              </div>
              <TileCluster tiles={menuTiles} size="48px" ignoreTheme />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
