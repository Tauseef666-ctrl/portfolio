import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const TOTAL_FRAMES = 240;
const FRAME_W = 1280;
const FRAME_H = 720;

function pad(num: number): string {
  return String(num).padStart(6, "0");
}

function getFrameUrl(index: number): string {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return `${isMobile ? "frames/mobile" : "frames"}/frame_${pad(index + 1)}.webp`;
}

type SequenceCanvasProps = {
  progressRef: RefObject<number>;
  className?: string;
};

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }
  return [0, 0, Math.round(l * 100)];
}

export function SequenceCanvas({ progressRef, className }: SequenceCanvasProps) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    let lastDrawn = -1;
    const canvas = canvasRef.current;
    const thumb = document.createElement("canvas");
    thumb.width = 24;
    thumb.height = 24;
    const thumbCtx = thumb.getContext("2d", { willReadFrequently: true });

    const publishHue = (img: HTMLImageElement) => {
      if (!thumbCtx) return;
      thumbCtx.clearRect(0, 0, 24, 24);
      thumbCtx.drawImage(img, 0, 0, 24, 24);
      try {
        const { data } = thumbCtx.getImageData(0, 0, 24, 24);
        let r = 0,
          g = 0,
          b = 0;
        for (let i = 0; i < 576; i++) {
          r += data[i * 4];
          g += data[i * 4 + 1];
          b += data[i * 4 + 2];
        }
        const [h, s, l] = rgbToHsl(r / 576, g / 576, b / 576);
        const root = document.documentElement.style;
        root.setProperty("--frame-h", String(h));
        root.setProperty("--frame-s", `${Math.max(s, 24)}%`);
        root.setProperty("--frame-l", String(l));
      } catch {
        /* canvas not readable — ignore */
      }
    };

    const drawCover = (img: HTMLImageElement) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const cw = canvas.width;
      const ch = canvas.height;
      if (!cw || !ch) return;
      const scale = Math.max(cw / FRAME_W, ch / FRAME_H);
      const dw = FRAME_W * scale;
      const dh = FRAME_H * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const nearest = (index: number): HTMLImageElement | null => {
      if (cacheRef.current[index]) return cacheRef.current[index] as HTMLImageElement;
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = cacheRef.current[index - offset];
        if (prev) return prev;
        const next = cacheRef.current[index + offset];
        if (next) return next;
      }
      return null;
    };

    const sizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      lastDrawn = -1;
      const idx = clampIndex(progressRef.current ?? 0);
      const img = nearest(idx);
      if (img) {
        drawCover(img);
        publishHue(img);
      }
    };

    const loadSingle = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const cached = cacheRef.current[index];
        if (cached) {
          resolve(cached);
          return;
        }
        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          if (cancelled) return;
          cacheRef.current[index] = img;
          loadedCount += 1;
          setLoaded(loadedCount / TOTAL_FRAMES);
          resolve(img);
        };
        img.onerror = () => reject(new Error(`frame ${index}`));
      });
    };

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    let rafId = 0;
    const loop = () => {
      const index = clampIndex(progressRef.current ?? 0);
      if (index !== lastDrawn) {
        lastDrawn = index;
        const img = nearest(index);
        if (img) {
          drawCover(img);
          publishHue(img);
        }
      }
      rafId = window.requestAnimationFrame(loop);
    };
    rafId = window.requestAnimationFrame(loop);

    if (reduced) {
      const poster = clampIndex(progressRef.current ?? 0);
      loadSingle(poster)
        .then((img) => {
          if (cancelled) return;
          setReady(true);
          drawCover(img);
          publishHue(img);
        })
        .catch(() => {
          if (!cancelled) setReady(true);
        });
    } else {
      loadSingle(0)
        .then((img) => {
          if (cancelled) return;
          setReady(true);
          drawCover(img);
          publishHue(img);
        })
        .catch(() => {
          if (!cancelled) setReady(true);
        });

      const priority: number[] = [];
      for (let i = 6; i < TOTAL_FRAMES; i += 6) priority.push(i);
      priority.push(TOTAL_FRAMES - 1);

      Promise.all(priority.map((idx) => loadSingle(idx).catch(() => null))).then(() => {
        if (cancelled) return;
        const remaining: number[] = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (!cacheRef.current[i]) remaining.push(i);
        }
        let cursor = 0;
        const nextBatch = () => {
          if (cancelled || cursor >= remaining.length) return;
          const batch = remaining.slice(cursor, cursor + 4);
          cursor += 4;
          Promise.all(batch.map((idx) => loadSingle(idx).catch(() => null))).finally(() => {
            if (cancelled) return;
            if ("requestIdleCallback" in window) {
              (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(nextBatch);
            } else {
              setTimeout(nextBatch, 40);
            }
          });
        };
        nextBatch();
      });
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", sizeCanvas);
    };
  }, [reduced, progressRef]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`seq-canvas-frame ${className ?? ""}`}
        style={{ opacity: ready ? 1 : 0 }}
      />
      {!ready && (
        <div className="cinema-loader">
          <span className="cinema-rec" />
          <span>LOADING FOOTAGE</span>
          <b>{Math.round(loaded * 100)}%</b>
        </div>
      )}
    </>
  );
}

function clampIndex(progress: number): number {
  return Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1))));
}