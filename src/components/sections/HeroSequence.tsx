import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "../../data/profile";
import { useApp } from "../../hooks/useApp";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { InteractiveName } from "../effects/InteractiveName";
import { MagneticButton } from "../ui/MagneticButton";

const SpatialBackdrop = lazy(() => import("../three/SpatialBackdrop"));

const TOTAL_FRAMES = 240;

function formatFrameNumber(num: number): string {
  return String(num).padStart(6, "0");
}

export function HeroSequence() {
  const { scrollTo } = useApp();
  const reduced = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesCache = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [loadedRatio, setLoadedRatio] = useState(0);
  const [isInView, setIsInView] = useState(true);

  // Path generator based on screen width
  const getFrameUrl = (index: number) => {
    const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 768;
    const base = isMobileDevice ? "frames/mobile" : "frames";
    return `${base}/frame_${formatFrameNumber(index + 1)}.webp`;
  };

  // 1. Initial priority loading & progressive background stream
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    const loadSingleFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (framesCache.current[index]) {
          return resolve(framesCache.current[index]!);
        }
        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          if (isCancelled) return;
          framesCache.current[index] = img;
          loadedCount++;
          setLoadedRatio(loadedCount / TOTAL_FRAMES);
          resolve(img);
        };
        img.onerror = reject;
      });
    };

    // Stage 1: Load frame 0 immediately and draw
    loadSingleFrame(0)
      .then((firstImg) => {
        if (isCancelled) return;
        setFirstFrameLoaded(true);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(firstImg, 0, 0, canvas.width, canvas.height);
          }
        }
      })
      .catch(() => {});

    // If reduced motion, load frame 239 (final frame) as well
    if (reduced) {
      loadSingleFrame(TOTAL_FRAMES - 1)
        .then((lastImg) => {
          if (isCancelled) return;
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(lastImg, 0, 0, canvas.width, canvas.height);
            }
          }
        })
        .catch(() => {});
      return () => {
        isCancelled = true;
      };
    }

    // Stage 2: Priority keyframes (every 6th frame)
    const priorityIndices: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i += 6) {
      if (i !== 0) priorityIndices.push(i);
    }
    priorityIndices.push(TOTAL_FRAMES - 1);

    Promise.all(priorityIndices.map((idx) => loadSingleFrame(idx).catch(() => null))).then(() => {
      if (isCancelled) return;

      // Stage 3: Progressive queue for remaining frames in background
      const remainingIndices: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!framesCache.current[i]) remainingIndices.push(i);
      }

      let currentIndex = 0;
      const loadNextBatch = () => {
        if (isCancelled || currentIndex >= remainingIndices.length) return;
        const batch = remainingIndices.slice(currentIndex, currentIndex + 4);
        currentIndex += 4;

        Promise.all(batch.map((idx) => loadSingleFrame(idx).catch(() => null))).finally(() => {
          if (!isCancelled) {
            if ("requestIdleCallback" in window) {
              (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadNextBatch);
            } else {
              setTimeout(loadNextBatch, 40);
            }
          }
        });
      };

      loadNextBatch();
    });

    return () => {
      isCancelled = true;
    };
  }, [reduced]);

  // 2. IntersectionObserver to pause rendering when hero is out of view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "200px 0px 200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3. Smooth scroll tracking and frame rendering with lerp
  useEffect(() => {
    if (reduced || !isInView) return;

    let rafId = 0;
    let targetProgress = 0;
    let currentProgress = 0;
    let lastDrawnFrame = -1;

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;
      const rawProgress = -rect.top / scrollableDistance;
      targetProgress = Math.min(1, Math.max(0, rawProgress));
    };

    const render = () => {
      // Lerp progress for ultra-smooth cinematic motion
      currentProgress += (targetProgress - currentProgress) * 0.16;

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1)))
      );

      if (frameIndex !== lastDrawnFrame) {
        // Find current frame or fallback to nearest loaded frame
        let img = framesCache.current[frameIndex];
        if (!img) {
          for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
            if (frameIndex - offset >= 0 && framesCache.current[frameIndex - offset]) {
              img = framesCache.current[frameIndex - offset];
              break;
            }
            if (frameIndex + offset < TOTAL_FRAMES && framesCache.current[frameIndex + offset]) {
              img = framesCache.current[frameIndex + offset];
              break;
            }
          }
        }

        if (img) {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              lastDrawnFrame = frameIndex;
              setCurrentFrameIndex(frameIndex);
            }
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [reduced, isInView]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className={`hero-sequence-container ${reduced ? "is-reduced-motion" : ""}`}
    >
      <div className="hero-sequence-sticky">
        {/* Ambient 3D depth system */}
        <Suspense fallback={null}>
          <SpatialBackdrop />
        </Suspense>

        {/* Ambient subtle warm lighting glow behind frame */}
        <div className="hero-glow-warm" aria-hidden="true" />
        <div className="hero-glow-cool" aria-hidden="true" />

        <div className="hero-sequence-content">
          {/* Top kicker */}
          <motion.div
            className="hero-kicker-badge"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="hero-badge-dot" />
            <span>INTERACTIVE PERSPECTIVE · SCROLL TO SCRUB</span>
          </motion.div>

          {/* Central Cinematic Frame Canvas */}
          <div className="hero-frame-wrapper">
            <div className="hero-frame-border">
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                className="hero-frame-canvas"
                style={{
                  opacity: firstFrameLoaded ? 1 : 0,
                  transition: "opacity 0.6s ease",
                }}
              />

              {/* Cinematic Vignette Overlay */}
              <div className="hero-frame-vignette" aria-hidden="true" />

              {/* High-tech HUD overlays */}
              <div className="hero-hud-tl">
                <span className="hud-indicator" />
                <span>REC · 24 FPS</span>
              </div>
              <div className="hero-hud-tr">
                <span>
                  FRAME {String(currentFrameIndex + 1).padStart(3, "0")} / {TOTAL_FRAMES}
                </span>
              </div>
              <div className="hero-hud-bl">
                <span>1280 × 720 · CINEMATIC DYNAMIC</span>
              </div>

              {/* Progress bar inside HUD */}
              <div className="hero-hud-scrubber" aria-hidden="true">
                <div
                  className="hero-hud-scrubber-fill"
                  style={{ width: `${((currentFrameIndex + 1) / TOTAL_FRAMES) * 100}%` }}
                />
              </div>

              {!firstFrameLoaded && (
                <div className="hero-frame-loader">
                  <div className="hero-frame-spinner" />
                  <span>INITIALIZING HERO SEQUENCE…</span>
                  <span className="hero-frame-progress">
                    {Math.round(loadedRatio * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Refined Identity: TAUSEEF KHAN */}
          <div className="hero-identity-block">
            <InteractiveName name="TAUSEEF KHAN" />

            <motion.div
              className="hero-roles-pills"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {profile.roles.map((role) => (
                <span key={role} className="hero-role-pill">
                  {role}
                </span>
              ))}
            </motion.div>

            <motion.p
              className="hero-philosophy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              «{profile.heroIntro}»
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <MagneticButton
                className="btn btn-primary"
                onClick={() => scrollTo("#projects")}
              >
                Explore Projects ↓
              </MagneticButton>
              <MagneticButton
                className="btn btn-secondary"
                onClick={() => scrollTo("#certificates")}
              >
                Credentials (12) ↗
              </MagneticButton>
              <MagneticButton
                className="btn btn-ghost"
                onClick={() => scrollTo("#contact")}
              >
                Let&apos;s Connect
              </MagneticButton>
            </motion.div>
          </div>

          {/* Scroll Down Prompt (smoothly fades out as scroll progresses) */}
          <AnimatePresence>
            {currentFrameIndex < 12 && (
              <motion.div
                className="hero-scroll-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                aria-hidden="true"
              >
                <div className="mouse-wheel-icon">
                  <div className="wheel-ball" />
                </div>
                <span>SCROLL TO CONTROL ANIMATION</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
export default HeroSequence;
