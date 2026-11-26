import { useEffect, useState } from "react";
import type { SectionId } from "../data/site";

/**
 * Tracks which page section is under a reading line a third of the way down
 * the viewport. Returns null while the hero is in view.
 */
export function useActiveSection(ids: readonly SectionId[]) {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
      const line = header + (window.innerHeight - header) * 0.35;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }
      let current: SectionId | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}
