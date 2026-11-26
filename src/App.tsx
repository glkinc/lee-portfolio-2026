import { BackToTop } from "./components/layout/BackToTop";
import { scrollToElement } from "./lib/scrollToElement";
import { withBase } from "./lib/base";
import { AnimatePresence, MotionConfig } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { TileThemeProvider } from "./components/bauhaus/TileTheme";
import { Header } from "./components/layout/Header";
import { Hero } from "./components/sections/Hero";
import { CaseStudies } from "./components/sections/CaseStudies";
import { About } from "./components/sections/About";
import { Experience } from "./components/sections/Experience";
import { Contact } from "./components/sections/Contact";
import { CaseStudyOverlay } from "./components/overlay/CaseStudyOverlay";
import { sections, type SectionId } from "./data/site";
import { useRouter, type Route } from "./lib/router";
import { syncHead } from "./lib/seo";
import { useActiveSection } from "./lib/useActiveSection";
import { lockScroll, unlockScroll } from "./lib/scrollLock";

const sectionIds = sections.map((s) => s.id);

export function App({ initialRoute }: { initialRoute: Route }) {
  const { route, navigate } = useRouter(initialRoute);
  const trigger = useRef<HTMLElement | null>(null);
  const pushedOverlay = useRef(false);
  const active = useActiveSection(sectionIds);
  const openSlug = route.name === "case-study" ? route.slug : null;

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    syncHead(route);
  }, [route]);

  // Lock page scroll behind the overlay.
  useEffect(() => {
    if (!openSlug) return;
    lockScroll();
    return unlockScroll;
  }, [openSlug]);

  const openCaseStudy = useCallback(
    (slug: string, el: HTMLElement) => {
      trigger.current = el;
      pushedOverlay.current = true;
      navigate({ name: "case-study", slug });
    },
    [navigate],
  );

  const closeCaseStudy = useCallback(() => {
    if (pushedOverlay.current) {
      pushedOverlay.current = false;
      window.history.back();
    } else {
      navigate({ name: "home" }, { replace: true });
    }
    // Return focus to whatever opened the overlay once it has gone.
    window.setTimeout(() => trigger.current?.focus({ preventScroll: true }), 450);
  }, [navigate]);

  const showNext = useCallback(
    (slug: string) => navigate({ name: "case-study", slug }, { replace: true }),
    [navigate],
  );

  const goToSection = useCallback(
    (id: SectionId) => {
      if (openSlug) navigate({ name: "home" }, { replace: true });
      const el = document.getElementById(id);
      if (!el) return;
      window.history.replaceState({}, "", withBase(`/#${id}`));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() => scrollToElement(el, reduce));
      // Move focus with the scroll so keyboard/screen-reader users land in the section.
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    },
    [navigate, openSlug],
  );

  return (
    <MotionConfig reducedMotion="user">
      <TileThemeProvider>
          <a
            href="#main"
            className="label-md sr-only fixed top-3 left-3 z-[100] rounded-full bg-bg-inverse px-4 py-2 text-text-inverse focus:not-sr-only"
          >
            Skip to content
          </a>
          <div inert={!!openSlug}>
            <Header active={active} onNavigate={goToSection} />
            <BackToTop />
            <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
              <Hero />
              <CaseStudies onOpen={openCaseStudy} />
              <About />
              <Experience />
            </main>
            <Contact />
          </div>
          {/* initial={false}: a deep-linked case study renders fully on load (and in the prerendered HTML). */}
          <AnimatePresence initial={false}>
            {openSlug && (
              <CaseStudyOverlay
                key="case-study-overlay"
                slug={openSlug}
                onClose={closeCaseStudy}
                onNext={showNext}
              />
            )}
          </AnimatePresence>
      </TileThemeProvider>
    </MotionConfig>
  );
}
