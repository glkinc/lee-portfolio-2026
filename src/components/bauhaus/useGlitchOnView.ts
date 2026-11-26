import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView } from "motion/react";

/**
 * Returns a glitch key that increments whenever `ref` scrolls into view
 * (or only the first time with `once`). Pass it to Bauhaus tiles to replay
 * the glitch.
 */
export function useGlitchOnView(
  ref: RefObject<Element | null>,
  { once = false, amount = 0.4 }: { once?: boolean; amount?: number } = {},
) {
  const inView = useInView(ref, { once, amount });
  const [key, setKey] = useState(0);
  const prev = useRef(false);
  useEffect(() => {
    if (inView && !prev.current) setKey((k) => k + 1);
    prev.current = inView;
  }, [inView]);
  return key;
}

/** Glitch key that fires once after mount (hero "on load"). */
export function useGlitchOnMount(delay = 150) {
  const [key, setKey] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setKey(1), delay);
    return () => window.clearTimeout(t);
  }, [delay]);
  return key;
}
