import { useEffect, useRef, useState } from "react";
import { useIsTouch } from "../../hooks/useIsTouch";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface InteractiveNameProps {
  name?: string;
  mousePosRef?: React.RefObject<{ x: number; y: number; active: boolean }>;
}

export function InteractiveName({ name = "TAUSEEF KHAN" }: InteractiveNameProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const letters = name.split("");

  useEffect(() => {
    if (isTouch || reduced) return;

    let mouseX = -1000;
    let mouseY = -1000;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updateLetters = () => {
      const el = containerRef.current;
      if (el) {
        letterRefs.current.forEach((span) => {
          if (!span || span.textContent === " ") return;
          const rect = span.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dx = mouseX - centerX;
          const dy = mouseY - centerY;
          const dist = Math.hypot(dx, dy);
          const maxDist = 220;

          if (dist < maxDist) {
            const factor = Math.cos((dist / maxDist) * (Math.PI / 2));
            const liftY = -factor * 10;
            const shiftX = (dx / dist) * -factor * 4;
            const rotate = (dx / dist) * -factor * 6;
            const scale = 1 + factor * 0.12;

            span.style.transform = `translate3d(${shiftX}px, ${liftY}px, 0) rotate(${rotate}deg) scale(${scale})`;
            span.style.color = `rgba(255, 255, 255, 1)`;
            span.style.textShadow = `0 0 ${12 * factor}px rgba(245, 158, 11, ${0.8 * factor}), 0 0 ${28 * factor}px rgba(251, 191, 36, ${0.4 * factor})`;
          } else {
            span.style.transform = `translate3d(0, 0, 0) rotate(0deg) scale(1)`;
            span.style.color = "";
            span.style.textShadow = "";
          }
        });
      }
      rafId = requestAnimationFrame(updateLetters);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateLetters);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isTouch, reduced]);

  return (
    <h1
      ref={containerRef}
      className="hero-cinematic-name"
      aria-label={name}
    >
      {letters.map((char, i) => {
        if (char === " ") {
          return (
            <span key={i} className="hero-name-space" aria-hidden="true">
              &nbsp;
            </span>
          );
        }
        return (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className={`hero-name-letter ${hoveredIndex === i ? "is-direct-hover" : ""}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            aria-hidden="true"
          >
            {char}
          </span>
        );
      })}
    </h1>
  );
}
