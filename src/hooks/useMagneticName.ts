import { useEffect, type RefObject } from "react";

type MagneticTarget = { x: number; y: number; r: number; s: number };
type CharGeom = { x: number; y: number; w: number; h: number };

function easeIn(v: number): number {
  return 1 - Math.pow(1 - v, 2.4);
}

/**
 * Character-by-character magnetic typography:
 * each letter reacts to the cursor on its own — as the pointer sweeps the name,
 * the letter it is closest to rises, tilts and pops in size while it retreats
 * into a follow-through arc; neighbours ease in behind it. The reach is kept
 * tight to a single letter (+neighbours) so it reads as a wave of individual
 * characters, not a blocky word drift.
 *
 * Performance: each letter's layout offset is measured once (cached, then
 * refreshed on resize / font-load), so a frame reads a single
 * getBoundingClientRect on the whole name instead of one rect per letter.
 * The animation loop also pauses whenever the name is off-screen.
 */
export function useMagneticName(
  rootRef: RefObject<HTMLElement | null>,
  selector = ".cinema-name"
) {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    if (!root) return;
    const name = root.querySelector<HTMLElement>(selector);
    if (!name) return;

    const chars = Array.from(name.querySelectorAll<HTMLElement>(".cinema-name-char"));
    if (chars.length === 0) return;

    let alive = true;
    let inView = true;
    let raf = 0;
    let mx = -9999;
    let my = -9999;
    let over = false;

    let geom: CharGeom[] = [];
    const measure = () => {
      if (!alive) return;
      geom = chars.map((c) => ({
        x: c.offsetLeft + c.offsetWidth / 2,
        y: c.offsetTop + c.offsetHeight / 2,
        w: Math.max(c.offsetWidth, 1),
        h: Math.max(c.offsetHeight, 1),
      }));
    };
    measure();

    const current: MagneticTarget[] = chars.map(() => ({ x: 0, y: 0, r: 0, s: 1 }));
    const target: MagneticTarget[] = chars.map(() => ({ x: 0, y: 0, r: 0, s: 1 }));

    const loop = () => {
      if (!alive || !inView) {
        raf = 0;
        return;
      }
      const box = name.getBoundingClientRect();
      const pad = Math.max(box.width * 0.32, 120);
      const near =
        over ||
        (mx >= box.left - pad &&
          mx <= box.right + pad &&
          my >= box.top - pad &&
          my <= box.bottom + pad);

      for (let i = 0; i < chars.length; i++) {
        const g = geom[i];
        const cx = box.left + g.x + current[i].x;
        const cy = box.top + g.y + current[i].y;

        let x = 0;
        let y = 0;
        let r = 0;
        let s = 1;

        if (near) {
          const d = Math.hypot(mx - cx, my - cy);
          // Tight per-letter reach: the letter the pointer is on reacts fully,
          // neighbours half, and once you leave a letter it settles.
          const radius = Math.max(g.w * 1.55, 44);
          const falloff = Math.max(0, 1 - d / radius);
          const w = easeIn(falloff);
          const dx = (mx - cx) / Math.max(g.w * 0.5, 1);
          const dy = (my - cy) / Math.max(g.h, 1);
          x = dx * w * Math.min(g.w * 1.05, 44);
          y = dy * w * Math.min(g.h * 0.85, 30) - w * g.h * 0.2;
          r = -dx * w * 20;
          s = 1 + w * 0.16;
        }

        target[i].x = x;
        target[i].y = y;
        target[i].r = r;
        target[i].s = s;

        const c = current[i];
        c.x += (target[i].x - c.x) * 0.14;
        c.y += (target[i].y - c.y) * 0.14;
        c.r += (target[i].r - c.r) * 0.14;
        c.s += (target[i].s - c.s) * 0.18;

        if (Math.abs(c.x) > 0.01 || Math.abs(c.y) > 0.01 || Math.abs(c.r) > 0.01 || Math.abs(c.s - 1) > 0.002) {
          chars[i].style.transform = `translate3d(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px, 0) rotate(${c.r.toFixed(2)}deg) scale(${c.s.toFixed(3)})`;
        }
      }

      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      start();
    };

    const onEnter = () => {
      over = true;
      start();
    };

    const onLeave = () => {
      over = false;
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView) start();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "220px 0px" }
    );
    io.observe(name);

    name.addEventListener("mousemove", onMove, { passive: true });
    name.addEventListener("mouseenter", onEnter);
    name.addEventListener("mouseleave", onLeave);

    const refresh = () => measure();
    window.addEventListener("resize", refresh);
    if (typeof document.fonts !== "undefined") {
      document.fonts.ready.then(refresh).catch(() => undefined);
    }
    const settle = window.setTimeout(refresh, 400);

    start();

    return () => {
      alive = false;
      io.disconnect();
      window.clearTimeout(settle);
      window.removeEventListener("resize", refresh);
      name.removeEventListener("mousemove", onMove);
      name.removeEventListener("mouseenter", onEnter);
      name.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rootRef, selector]);
}