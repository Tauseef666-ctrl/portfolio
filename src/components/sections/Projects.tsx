import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projects, type Project } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading kicker="Projects" title="Experience My Work" center />
      </div>

      <Reveal>
        <div className="projects-scroller">
          {projects.map((project) => (
            <button
              key={project.id}
              className="project-card"
              data-cursor="view"
              onClick={() => setSelected(project)}
              style={{ "--accent": project.accent } as React.CSSProperties}
            >
              <div className="pc-glow" aria-hidden="true" />
              <span className="project-name">{project.name}</span>
              <span className="project-status">{project.status}</span>
              <span className="project-tagline">{project.tagline}</span>
              <span className="project-techs">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </span>
              <span className="project-view">
                View Project <span className="arrow">→</span>
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      <p className="projects-hint">← Drag or scroll →  ·  Tap a card to open it</p>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="project-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="project-modal-panel"
              initial={{ opacity: 0, scale: 0.86, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="pm-close" onClick={() => setSelected(null)} aria-label="Close">
                ✕
              </button>
              <span className="project-status" style={{ ["--accent" as string]: selected.accent }}>
                {selected.status}
              </span>
              <h3>{selected.name}</h3>
              <p style={{ color: "var(--text-dim)" }}>{selected.tagline}</p>

              <div className="pm-section">
                <h4>Overview</h4>
                <p>{selected.description}</p>
              </div>

              <div className="pm-section">
                <h4>My Contribution</h4>
                <p>{selected.contribution}</p>
              </div>

              <div className="pm-section">
                <h4>Technologies</h4>
                <div className="project-techs">
                  {selected.technologies.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>

              {(selected.github || selected.demo) && (
                <div className="pm-links">
                  {selected.github && (
                    <a
                      className="btn btn-ghost"
                      href={selected.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {selected.demo && (
                    <a
                      className="btn btn-primary"
                      href={selected.demo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
