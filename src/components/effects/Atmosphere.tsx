import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Fixed, evolving background that belongs to the film's world:
 * warm dark base + aurora glows tinted by the on-screen frame hue,
 * moving gently with scroll progress. Grain + vignette on top.
 */
export function Atmosphere() {
  const reduced = useReducedMotion();
  const a1Ref = useRef<HTMLDivElement>(null);
  const a2Ref = useRef<HTMLDivElement>(null);
  const a3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a1 = a1Ref.current;
    const a2 = a2Ref.current;
    const a3 = a3Ref.current;

    const setProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      document.documentElement.style.setProperty("--scroll-progress", String(p));
    };

    // Reduced motion: the auroras stay put, so just keep the scroll-progress
    // bar in sync on the rare scroll/resize events — no animation loop.
    if (reduced) {
      setProgress();
      window.addEventListener("scroll", setProgress, { passive: true });
      window.addEventListener("resize", setProgress);
      return () => {
        window.removeEventListener("scroll", setProgress);
        window.removeEventListener("resize", setProgress);
      };
    }

    // Animated backdrop. ONE rAF source writes both the scroll-progress var and
    // the aurora transforms, capped at ~30fps. The drift is so slow that every
    // other frame is visually identical, but it halves the continuous repaint
    // of the three huge blur(90px) layers. Selected scroll is read live here.
    let raf = 0;
    let alive = true;
    let t = 0;
    let last = 0;
    const loop = (ts: number) => {
      if (!alive) return;
      if (ts - last >= 32) {
        const dt = ts - last;
        last = ts;
        t += dt * 0.00018;
        const root = document.documentElement.style;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        root.setProperty("--scroll-progress", String(p));
        if (a1) {
          a1.style.transform = `translate(${p * 34}px, ${Math.sin(t) * 26}px) scale(${1 + Math.sin(t * 0.7) * 0.1})`;
          a1.style.opacity = String(0.8 + p * 0.25);
        }
        if (a2) {
          a2.style.transform = `translate(${(1 - p) * -30}px, ${Math.cos(t * 0.8) * 30}px) scale(${1 + Math.cos(t * 0.6) * 0.08})`;
          a2.style.opacity = String(0.75 + (1 - p) * 0.25);
        }
        if (a3) {
          a3.style.transform = `translate(${p * -24}px, ${Math.sin(t * 0.6 + 2) * 22}px)`;
          a3.style.opacity = String(0.7 + p * 0.3);
        }
      }
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atm-base" />
      <div className="atm-aurora atm-a1" ref={a1Ref} />
      <div className="atm-aurora atm-a2" ref={a2Ref} />
      <div className="atm-aurora atm-a3" ref={a3Ref} />
      <div className="atm-grid" />
      <div className="atm-grain" />
      <div className="atm-vignette" />
    </div>
  );
}