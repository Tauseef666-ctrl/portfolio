import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap } from "../../lib/gsap";
import { projects, type Project } from "../../data/profile";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { MagneticButton } from "../ui/MagneticButton";

function WorkPanel({ project, index }: { project: Project; index: number }) {
  return (
    <article className="work-panel" style={{ "--panel-accent": project.accent } as CSSProperties}>
      <div className="work-panel-index">{String(index + 1).padStart(2, "0")}</div>
      <div>
        <h3 className="work-panel-name">{project.name}</h3>
        <p className="work-panel-tagline">{project.tagline}</p>
        <div className="work-panel-tech">
          {project.technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
      <div className="work-panel-actions">
        {project.github && (
          <MagneticButton href={project.github} className="btn btn-ghost btn-sm" strength={0.3}>
            GitHub ↗
          </MagneticButton>
        )}
        {project.demo && (
          <MagneticButton href={project.demo} className="btn btn-primary btn-sm" strength={0.3}>
            Live ↗
          </MagneticButton>
        )}
      </div>
      {project.status && <div className="work-status">{project.status}</div>}
    </article>
  );
}

export function WorkScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            pin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="work" ref={sectionRef} className="scene work">
      <div ref={pinRef} className="work-pin">
        <div className="container">
          <div className="scene-head work-head">
            <div className="scene-num">SCENE 04</div>
            <div className="scene-eyebrow">The Work</div>
            <h2 className="scene-title">Projects as scenes.</h2>
          </div>
        </div>
        <div ref={trackRef} className="work-track">
          {projects.map((project, i) => (
            <WorkPanel key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
      <div className="work-hint">Scroll — the track advances</div>
    </section>
  );
}
export default WorkScene;