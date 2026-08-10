import { useEffect, useRef } from "react";
import { useIsTouch } from "../../hooks/useIsTouch";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
};

export function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mouse = { x: -9999, y: -9999 };
    let nodes: Node[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = isTouch ? 20 : 42;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.2 + 1.4,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const step = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;

        const dxm = mouse.x - n.x;
        const dym = mouse.y - n.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 140) {
          n.x += (dxm / dm) * 0.35;
          n.y += (dym / dm) * 0.35;
        }
      }

      const linkDist = 110;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - d / linkDist) * 0.32})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        const dm = Math.hypot(mouse.x - a.x, mouse.y - a.y);
        if (dm < 160) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(232, 121, 249, ${(1 - dm / 160) * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        const glow = 0.5 + 0.5 * Math.sin(t * 0.002 + a.pulse);
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${0.35 + glow * 0.45})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${0.06 + glow * 0.1})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [isTouch, reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
