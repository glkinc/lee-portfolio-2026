import { animate } from "motion";

let current: { stop: () => void } | null = null;

/**
 * Eased, deliberately slow scroll to an element. Duration scales with distance
 * (about 1.4–2.6s) so long jumps stay readable. Any wheel/touch/key input from
 * the user cancels it. Reduced motion jumps straight there.
 */
export function scrollToElement(el: HTMLElement, reduce: boolean) {
  current?.stop();
  const from = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const to = Math.min(max, Math.max(0, el.getBoundingClientRect().top + from));
  if (reduce || Math.abs(to - from) < 2) {
    window.scrollTo({ top: to, behavior: "instant" });
    return;
  }
  const duration = Math.min(2.6, Math.max(1.4, Math.abs(to - from) / 1400));
  const cancel = () => controls.stop();
  const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
  const controls = animate(from, to, {
    duration,
    ease: [0.65, 0, 0.35, 1],
    onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
    onComplete: () => events.forEach((e) => window.removeEventListener(e, cancel)),
  });
  events.forEach((e) => window.addEventListener(e, cancel, { passive: true }));
  const stop = controls.stop.bind(controls);
  current = {
    stop: () => {
      stop();
      events.forEach((e) => window.removeEventListener(e, cancel));
    },
  };
}
