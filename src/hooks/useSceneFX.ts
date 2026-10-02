import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Drives a single scene section:
 *  - `[data-reveal]` elements fade/rise into view once.
 *  - `[data-depth]` elements move at their own parallax speed over the section.
 * Cleaned up via gsap.context + ScrollTrigger.killAll inner scope only.
 */
export function useSceneFX<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]", el).forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-depth]", el).forEach((item) => {
        const depth = Number(item.dataset.depth || 0.2);
        gsap.fromTo(
          item,
          { y: 0 },
          {
            y: 120 * depth,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return ref;
}