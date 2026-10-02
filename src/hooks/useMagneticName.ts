import { useEffect, type RefObject } from "react";

type MagneticTarget = { x: number; y: number; r: number };

function easeIn(v: number): number {
  return 1 - Math.pow(1 - v, 2.4);
}

/**
 * Character-by-character magnetic typography:
 * each letter of the name drifts toward the cursor with a
 * distance falloff — strongest for the letter under the pointer,
 * subtle for neighbours, none for letters far away.
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

    let mx = -9999;
    let my = -9999;
    let over = false;
    let raf = 0;

    const current: MagneticTarget[] = chars.map(() => ({ x: 0, y: 0, r: 0 }));
    const target: MagneticTarget[] = chars.map(() => ({ x: 0, y: 0, r: 0 }));

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onEnter = () => {
      over = true;
    };

    const onLeave = () => {
      over = false;
    };

    const loop = () => {
      const box = name.getBoundingClientRect();
      const near =
        over ||
        (mx >= box.left - 70 &&
          mx <= box.right + 70 &&
          my >= box.top - 70 &&
          my <= box.bottom + 70);

      for (let i = 0; i < chars.length; i++) {
        const b = chars[i].getBoundingClientRect();
        const cx = b.left + b.width / 2;
        const cy = b.top + b.height / 2;

        let x = 0;
        let y = 0;
        let r = 0;

        if (near) {
          const d = Math.hypot(mx - cx, my - cy);
          const radius = Math.max(b.width * 2.4, 52);
          const falloff = Math.max(0, 1 - d / radius);
          const w = easeIn(falloff);
          const dx = (mx - cx) / Math.max(b.width * 0.5, 1);
          const dy = (my - cy) / Math.max(b.height, 1);
          x = dx * w * Math.min(b.width * 0.55, 30);
          y = dy * w * Math.min(b.height * 0.4, 12) - w * b.height * 0.12;
          r = -dx * w * 11;
        }

        target[i].x = x;
        target[i].y = y;
        target[i].r = r;

        const c = current[i];
        c.x += (target[i].x - c.x) * 0.16;
        c.y += (target[i].y - c.y) * 0.16;
        c.r += (target[i].r - c.r) * 0.16;

        chars[i].style.transform = `translate3d(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px, 0) rotate(${c.r.toFixed(2)}deg)`;
      }

      raf = requestAnimationFrame(loop);
    };

    name.addEventListener("mousemove", onMove, { passive: true });
    name.addEventListener("mouseenter", onEnter);
    name.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      name.removeEventListener("mousemove", onMove);
      name.removeEventListener("mouseenter", onEnter);
      name.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [rootRef, selector]);
}