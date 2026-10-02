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
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      document.documentElement.style.setProperty("--scroll-progress", String(p));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const a1 = a1Ref.current;
    const a2 = a2Ref.current;
    const a3 = a3Ref.current;
    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.003;
      const root = document.documentElement.style;
      const p = Number(root.getPropertyValue("--scroll-progress")) || 0;
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
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
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