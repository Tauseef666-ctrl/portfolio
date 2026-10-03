/**
 * ============================================================================
 *  FRAME SEQUENCE — the reusable scroll-driven film player.
 *
 *  Owns everything about the 719-frame sequence:
 *    initializeFrameSequence()  — size the canvas, start the render loop
 *    loadFrame(index)           — decode + cache one frame
 *    preloadFrames(indices?)    — priority-load a set (or all, in idle batches)
 *    renderFrame(index)         — draw the nearest available frame to the canvas
 *    setProgress(progress)      — 0..1 → nearest index, draw on change
 *    destroyFrameSequence()     — release everything
 *
 *  Frames are drawn CONTAINED and centred, so the character always occupies
 *  the same area of the stage as the composition was designed around.
 *  ============================================================================
 */

export const FRAME_COUNT = 719;
export const FRAME_W = 1280;
export const FRAME_H = 720;

export type FrameSource = (index: number) => string;

export type FramePlayerOptions = {
  canvas: HTMLCanvasElement;
  getProgress: () => number;
  reduced: boolean;
  source?: FrameSource;
  onReady?: () => void;
  onLoadProgress?: (fraction: number) => void;
  onHue?: (h: number, s: number, l: number) => void;
};

export interface FramePlayer {
  initializeFrameSequence: () => void;
  loadFrame: (index: number) => Promise<HTMLImageElement>;
  preloadFrames: (indices?: number[]) => Promise<void>;
  renderFrame: (index: number) => boolean;
  setProgress: (progress: number) => void;
  destroyFrameSequence: () => void;
  isReady: () => boolean;
}

function pad(num: number): string {
  return String(num).padStart(6, "0");
}

function defaultSource(index: number): string {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  return `${mobile ? "frames/mobile" : "frames"}/frame_${pad(index + 1)}.webp`;
}

function clampIndex(progress: number): number {
  const len = FRAME_COUNT - 1;
  return Math.min(len, Math.max(0, Math.round(progress * len)));
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, Math.round(l * 100)];
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h /= 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function createFramePlayer(options: FramePlayerOptions): FramePlayer {
  const {
    canvas,
    getProgress,
    reduced,
    source = defaultSource,
    onReady,
    onLoadProgress,
    onHue,
  } = options;

  const cache: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
  const thumb = document.createElement("canvas");
  thumb.width = 24;
  thumb.height = 24;
  const thumbCtx = thumb.getContext("2d", { willReadFrequently: true });

  let cancelled = false;
  let initialized = false;
  let ready = false;
  let loadedCount = 0;
  let lastDrawn = -1;
  let lastHueAt = 0;
  let lastHueIndex = -1;
  let rafId = 0;
  let resizeObserver: ResizeObserver | null = null;

  const publishHue = (img: HTMLImageElement) => {
    if (!thumbCtx) return;
    const now = performance.now();
    if (now - lastHueAt < 160) return;
    lastHueAt = now;
    thumbCtx.clearRect(0, 0, 24, 24);
    thumbCtx.drawImage(img, 0, 0, 24, 24);
    try {
      const { data } = thumbCtx.getImageData(0, 0, 24, 24);
      let r = 0;
      let g = 0;
      let b = 0;
      for (let i = 0; i < 576; i++) {
        r += data[i * 4];
        g += data[i * 4 + 1];
        b += data[i * 4 + 2];
      }
      const [h, s, l] = rgbToHsl(r / 576, g / 576, b / 576);
      onHue?.(h, Math.max(s, 24), l);
    } catch {
      /* canvas not readable — ignore */
    }
  };

  const sizeCanvas = () => {
    if (!canvas || !initialized || cancelled) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.15);
    const cw = Math.round(canvas.clientWidth * dpr);
    const ch = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== cw) canvas.width = cw;
    if (canvas.height !== ch) canvas.height = ch;
    lastDrawn = -1;
    const idx = clampIndex(getProgress());
    const img = nearest(idx);
    if (img) {
      drawFrame(idx, img);
      publishHue(img);
    }
  };

  const drawFrame = (index: number, img: HTMLImageElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    if (!cw || !ch) return;
    // Cover mode: scale so the frame always fills the full canvas, cropping edges
    const scale = Math.max(cw / FRAME_W, ch / FRAME_H);
    const dw = FRAME_W * scale;
    const dh = FRAME_H * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    void index;
  };

  const nearest = (index: number): HTMLImageElement | null => {
    if (cache[index]) return cache[index];
    for (let offset = 1; offset < FRAME_COUNT; offset++) {
      const prev = cache[index - offset];
      if (prev) return prev;
      const next = cache[index + offset];
      if (next) return next;
    }
    return null;
  };

  const loadFrame = (index: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const cached = cache[index];
      if (cached) {
        resolve(cached);
        return;
      }
      const img = new Image();
      img.decoding = "async";
      img.src = source(index);
      img.onload = () => {
        if (cancelled) return;
        cache[index] = img;
        loadedCount += 1;
        onLoadProgress?.(loadedCount / FRAME_COUNT);
        if (!ready && index === 0) {
          ready = true;
          onReady?.();
        }
        resolve(img);
      };
      img.onerror = () => reject(new Error(`frame ${index} failed`));
    });
  };

  const preloadFrames = async (indices?: number[]): Promise<void> => {
    if (reduced) return;
    const priority: number[] =
      indices && indices.length > 0
        ? indices
        : buildPriorityIndices();
    await Promise.all(priority.map((idx) => loadFrame(idx).catch(() => null)));
    if (cancelled) return;
    const remaining: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      if (!cache[i]) remaining.push(i);
    }
    let cursor = 0;
    const hasIdle = typeof globalThis.requestIdleCallback === "function";
    const nextBatch = (): void => {
      if (cancelled || cursor >= remaining.length) return;
      const count = 2;
      const batch = remaining.slice(cursor, cursor + count);
      cursor += count;
      Promise.all(batch.map((idx) => loadFrame(idx).catch(() => null))).finally(() => {
        if (cancelled) return;
        if (hasIdle) {
          globalThis.requestIdleCallback(nextBatch, { timeout: 2400 });
        } else {
          globalThis.setTimeout(nextBatch, 220);
        }
      });
    };
    nextBatch();
  };

  const buildPriorityIndices = (): number[] => {
    const indices: number[] = [0];
    for (let i = 6; i < FRAME_COUNT; i += 6) indices.push(i);
    indices.push(FRAME_COUNT - 1);
    return indices;
  };

  const renderFrame = (index: number): boolean => {
    const img = nearest(index);
    if (!img) return false;
    drawFrame(index, img);
    if (index !== lastHueIndex) {
      lastHueIndex = index;
      publishHue(img);
    }
    return true;
  };

  const setProgress = (progress: number): void => {
    const index = clampIndex(progress);
    if (index !== lastDrawn) {
      lastDrawn = index;
      renderFrame(index);
    }
  };

  const loop = () => {
    if (cancelled) return;
    setProgress(getProgress());
    rafId = window.requestAnimationFrame(loop);
  };

  const initializeFrameSequence = (): void => {
    initialized = true;
    sizeCanvas();
    resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sizeCanvas) : null;
    if (resizeObserver && canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    if (reduced) {
      loadFrame(0)
        .then(() => {
          if (cancelled) return;
          ready = true;
          onReady?.();
          renderFrame(0);
        })
        .catch(() => {
          if (!cancelled) onReady?.();
        });
      return;
    }

    loadFrame(0)
      .then(() => {
        if (cancelled) return;
        ready = true;
        onReady?.();
        renderFrame(0);
      })
      .catch(() => {
        if (!cancelled) onReady?.();
      });

    preloadFrames();
    rafId = window.requestAnimationFrame(loop);
  };

  const destroyFrameSequence = (): void => {
    cancelled = true;
    if (rafId) window.cancelAnimationFrame(rafId);
    resizeObserver?.disconnect();
    resizeObserver = null;
    cache.fill(null);
    initialized = false;
  };

  const isReady = (): boolean => ready;

  return {
    initializeFrameSequence,
    loadFrame,
    preloadFrames,
    renderFrame,
    setProgress,
    destroyFrameSequence,
    isReady,
  };
}