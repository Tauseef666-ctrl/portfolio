import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const tail = tailRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !tail || !label) return;

    document.body.classList.add("cursor-on");

    let x = -100;
    let y = -100;
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;
    let tailX = -100;
    let tailY = -100;
    let lastX = -100;
    let lastY = -100;
    let vx = 0;
    let vy = 0;
    let sVx = 0;
    let sVy = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      vx = x - lastX;
      vy = y - lastY;
      lastX = x;
      lastY = y;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      const nameText = target.closest<HTMLElement>(".cinema-name");
      const interactive = target.closest("a, button, [role='button'], input, textarea");

      if (nameText) {
        document.body.classList.add("cursor-active");
        ring.classList.add("is-text");
        ring.classList.remove("is-label", "is-hover");
        label.textContent = "";
      } else if (labelled) {
        document.body.classList.add("cursor-active");
        ring.classList.remove("is-text");
        ring.classList.add("is-label");
        const text = labelled.dataset.cursor;
        label.textContent = text || "VIEW";
      } else if (interactive) {
        document.body.classList.add("cursor-active");
        ring.classList.remove("is-text");
        ring.classList.add("is-hover");
        label.textContent = "";
      } else {
        document.body.classList.remove("cursor-active");
        ring.classList.remove("is-label", "is-hover", "is-text");
        label.textContent = "";
      }
    };

    const loop = () => {
      dotX += (x - dotX) * 0.6;
      dotY += (y - dotY) * 0.6;
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      tailX += (x - tailX) * 0.7;
      tailY += (y - tailY) * 0.7;

      sVx = sVx * 0.82 + vx * 0.18;
      sVy = sVy * 0.82 + vy * 0.18;
      const speed = Math.min(1, Math.hypot(sVx, sVy) / 42);
      const angle = Math.atan2(sVy, sVx) * (180 / Math.PI);

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      tail.style.transform = `translate3d(${tailX}px, ${tailY}px, 0) rotate(${angle}deg) scaleX(${0.25 + 0.75 * speed})`;
      tail.style.opacity = String(0.22 + 0.62 * speed);

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove("cursor-on");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={tailRef} className="cursor-tail" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} />
      </div>
    </>
  );
}