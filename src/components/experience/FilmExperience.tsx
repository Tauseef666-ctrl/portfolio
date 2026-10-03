import { useCallback, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { ACTS } from "../../data/acts";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useApp } from "../../hooks/useApp";
import { SequenceCanvas } from "../effects/SequenceCanvas";
import { ActView, ContactSection, IntroAct } from "./acts";

/**
 * The single continuous experience.
 *
 * The film stage STICKS to the viewport with plain CSS (no GSAP pin) while the
 * character scrubs with the scroll. Every act is a real, fully laid-out page
 * section that flows over the stage — so all content is always on the page:
 * nothing is clipped, nothing fades before it's been read, and no act needs
 * its own scrollbar. Cards simply reveal as the page scroll carries them in.
 */
export function FilmExperience() {
  const reduced = useReducedMotion();
  const { setActiveAct } = useApp();
  const rootRef = useRef<HTMLElement>(null);
  const scrubRef = useRef(0);
  const lastTickRef = useRef(-1);

  const onHue = useCallback((h: number, s: number, l: number) => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--frame-h", String(h));
    root.style.setProperty("--frame-s", `${s}%`);
    root.style.setProperty("--frame-l", `${l}%`);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const actEls = gsap.utils.toArray<HTMLElement>(".act", root);

    // Content order: hero (intro), the five .act sections, then the contact
    // section (reach) which lives outside the film root.
    const probes: { el: HTMLElement; index: number }[] = [];
    const heroEl = root.querySelector<HTMLElement>(".film-hero");
    if (heroEl) probes.push({ el: heroEl, index: 0 });
    actEls.forEach((el, i) => probes.push({ el, index: i + 1 }));
    const contactEl = document.querySelector<HTMLElement>(".contact");
    if (contactEl) probes.push({ el: contactEl, index: ACTS.length - 1 });

    const updateAct = (index: number) => {
      if (index !== lastTickRef.current) {
        lastTickRef.current = index;
        setActiveAct(index);
      }
      const activeId = ACTS[index].id;
      actEls.forEach((el) => el.setAttribute("aria-hidden", String(el.id !== activeId)));
    };

    const activeByScroll = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      probes.forEach(({ el, index }) => {
        if (el.getBoundingClientRect().top <= mid) best = index;
      });
      return best;
    };

    updateAct(0);

    const ctx = gsap.context(() => {
      if (reduced) {
        root.classList.add("film--static");
        let lastScan = 0;
        ScrollTrigger.create({
          trigger: root,
          start: "top 80%",
          end: "bottom 20%",
          onUpdate: () => {
            const now = performance.now();
            if (now - lastScan < 160) return;
            lastScan = now;
            updateAct(activeByScroll());
          },
        });
        return;
      }

      root.classList.add("film--running");

      let lastActScan = 0;
      const scanActiveAct = () => {
        const now = performance.now();
        if (now - lastActScan < 140) return;
        lastActScan = now;
        updateAct(activeByScroll());
      };

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          scrubRef.current = self.progress;
          scanActiveAct();
        },
        onEnter: () => {
          scrubRef.current = 0;
          updateAct(0);
        },
      });

      const cardEls = gsap.utils.toArray<HTMLElement>(".act-in", root);
      root.classList.add("film--anim");

      // ScrollTrigger "top bottom" = card's top edge touches viewport bottom.
      // This is the only reliable trigger for "appears as it enters from below".
      ScrollTrigger.batch(cardEls, {
        start: "top bottom",   // fires when card top hits the bottom of the viewport
        once: true,            // add is-visible once, never remove
        onEnter: (batch) => {
          batch.forEach((el) => el.classList.add("is-visible"));
        },
      });

      const hero = root.querySelector<HTMLElement>(".film-hero");
      if (hero) {
        gsap.to(hero, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=14%",
            scrub: 0.6,
          },
        });
      }

      const panels = gsap.utils.toArray<HTMLElement>(".act-inner", root);
      panels.forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 2 },
          {
            yPercent: -2,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced, setActiveAct]);

  return (
    <>
      <section
        id="film"
        ref={rootRef}
        className="film"
        aria-label="Continuous scroll portfolio — the animated character stays centre-stage while every section flows past it"
      >
        <div className="film-stage">
          <SequenceCanvas progressRef={scrubRef} onHue={onHue} />

          <div className="film-vignette" aria-hidden="true" />

          <div className="film-hero" id="intro">
            <IntroAct />
          </div>
        </div>

        <div className="film-acts">
          {ACTS.filter((a) => a.id !== "reach" && a.id !== "intro").map((a) => (
            <ActView key={a.id} act={a} />
          ))}
        </div>
      </section>
      <ContactSection />
    </>
  );
}
export default FilmExperience;