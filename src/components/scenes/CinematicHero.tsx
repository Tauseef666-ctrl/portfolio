import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap } from "../../lib/gsap";
import { profile } from "../../data/profile";
import { useApp } from "../../hooks/useApp";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SequenceCanvas } from "../effects/SequenceCanvas";
import { MagneticButton } from "../ui/MagneticButton";

const SCENE_COUNT = 8;

function NameLetters({ name }: { name: string }) {
  return (
    <h1 className="cinema-name" role="text" aria-label={name}>
      {name.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i} className="cinema-name-space" aria-hidden="true">
            &nbsp;
          </span>
        ) : (
          <span
            key={i}
            className="cinema-name-letter"
            style={{ "--i": i } as CSSProperties}
            aria-hidden="true"
          >
            <span className="cinema-name-char">{ch}</span>
          </span>
        )
      )}
    </h1>
  );
}

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneCountRef = useRef<HTMLElement>(null);
  const scrubRef = useRef(0);
  const reduced = useReducedMotion();
  const { scrollTo } = useApp();

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    if (reduced) {
      scrubRef.current = 0;
      gsap.set([".cinema-type", ".cinema-meta", ".cinema-scroll-cue"], { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const letters = gsap.utils.toArray<HTMLElement>(".cinema-name-letter", section);
        const roles = gsap.utils.toArray<HTMLElement>(".cinema-role", section);
        const meta = gsap.utils.toArray<HTMLElement>(".cinema-meta", section);

        const updateSceneTag = (p: number) => {
          const n = Math.min(SCENE_COUNT, Math.max(1, Math.floor(p * SCENE_COUNT) + 1));
          if (sceneCountRef.current) sceneCountRef.current.textContent = String(n).padStart(2, "0");
        };

        const tl = gsap.timeline({
          scrub: 1,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=320%",
            pin: stage,
            anticipatePin: 1,
            onUpdate: (self) => {
              scrubRef.current = self.progress;
              updateSceneTag(self.progress);
            },
            onEnter: () => updateSceneTag(0),
          },
        });

        tl.to(stage, { scale: 1.09, ease: "none" }, 0.1);

        tl.fromTo(
          letters,
          { autoAlpha: 0, y: 96, rotateX: -22, filter: "blur(12px)" },
          { autoAlpha: 1, y: 0, rotateX: 0, filter: "blur(0px)", duration: 0.5, ease: "power4.out", stagger: 0.026 },
          0.1
        );

        tl.fromTo(".cinema-kicker", { autoAlpha: 0, y: -22 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.06);
        tl.fromTo(
          roles,
          { autoAlpha: 0, x: -18 },
          { autoAlpha: 1, x: 0, duration: 0.32, stagger: 0.06 },
          0.2
        );
        tl.fromTo(".cinema-prologue", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.34);
        tl.fromTo(".cinema-cta", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.44);
        tl.fromTo(meta, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.07 }, 0);
        tl.fromTo(".cinema-scroll-cue", { autoAlpha: 0 }, { autoAlpha: 0.8 }, 0.5);
        tl.fromTo(".cinema-scrub-fill", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);

        // The name stays on the scrolling frames — it only settles in depth with the footage.
        tl.to(letters, { y: -30, scale: 1.05, ease: "none", duration: 0.4 }, 0.62);

        // Supporting copy gives way first; the identity remains on the footage.
        tl.to([".cinema-roles", ".cinema-prologue", ".cinema-cta"], { autoAlpha: 0, y: -24, duration: 0.4 }, 0.66);
        tl.to([".cinema-kicker", ".cinema-scroll-cue", ...meta], { autoAlpha: 0, duration: 0.35 }, 0.72);

        // Final hand-off — the name exits as the pinned scene lets go.
        tl.to(letters, { autoAlpha: 0, y: -80, scale: 1.16, duration: 0.45, ease: "power3.in" }, 0.93);

        return () => {
          scrubRef.current = 0;
        };
      });

      mm.add("(max-width: 767px)", () => {
        scrubRef.current = 0;
        return () => {
          scrubRef.current = 0;
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        scrubRef.current = 0;
        gsap.set([".cinema-type", ".cinema-meta", ".cinema-scroll-cue"], { opacity: 1 });
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="intro" ref={sectionRef} className="cinema">
      <div ref={stageRef} className="cinema-stage">
        <SequenceCanvas progressRef={scrubRef} />
        <div className="cinema-scrim" />
        <div className="cinema-frame-border" />

        <div className="cinema-meta cinema-meta-tl">
          <span className="cinema-rec" />
          PORTFOLIO · VOL. 01
        </div>
        <div className="cinema-meta cinema-meta-tr">DIR. TAUSEEF KHAN</div>
        <div className="cinema-meta cinema-meta-bl">
          <span className="cinema-scrub">
            <span className="cinema-scrub-fill" />
          </span>
          SCROLL TO ADVANCE
        </div>
        <div className="cinema-meta cinema-meta-br">
          SCENE <b ref={sceneCountRef}>01</b> / 08
        </div>

        <div className="cinema-type">
          <div className="cinema-brand">
            <div className="cinema-kicker">The Reel</div>
            <NameLetters name="TAUSEEF KHAN" />
          </div>
          <div className="cinema-lower">
            <div className="cinema-roles">
              {profile.roles.map((r) => (
                <span key={r} className="cinema-role">
                  {r}
                </span>
              ))}
            </div>
            <p className="cinema-prologue">{profile.heroIntro}</p>
            <div className="cinema-cta">
              <MagneticButton className="btn btn-primary" onClick={() => scrollTo("#story")}>
                Enter the work
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="cinema-scroll-cue">
          <div className="mouse-wheel" />
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
}
export default CinematicHero;