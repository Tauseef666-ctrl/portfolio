import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projects, type Project } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";

type ProjectCategory = "all" | "ai" | "web" | "mobile";

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === "all") return true;
    const techs = p.technologies.map((t) => t.toLowerCase()).join(" ");
    const nameLower = p.name.toLowerCase();
    const tagLower = p.tagline.toLowerCase();

    if (selectedCategory === "ai") {
      return (
        techs.includes("ai") ||
        techs.includes("ollama") ||
        techs.includes("mediapipe") ||
        nameLower.includes("luna") ||
        nameLower.includes("edupath") ||
        nameLower.includes("ninja")
      );
    }
    if (selectedCategory === "mobile") {
      return (
        techs.includes("android") ||
        techs.includes("react native") ||
        techs.includes("expo") ||
        techs.includes("kotlin") ||
        techs.includes("java")
      );
    }
    if (selectedCategory === "web") {
      return (
        techs.includes("react") ||
        techs.includes("next.js") ||
        techs.includes("web") ||
        techs.includes("html") ||
        techs.includes("three.js")
      );
    }
    return true;
  });

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionHeading kicker="Showcase" title="Featured Projects & Systems" center />
        <p className="cert-note" style={{ textAlign: "center" }}>
          Explore full-stack platforms, 3D graphics environments, mobile applications, and offline AI tools.
        </p>

        {/* Filter categories */}
        <div className="filter-pill-row" role="tablist" aria-label="Project categories">
          {[
            { id: "all", label: `All Systems (${projects.length})` },
            { id: "ai", label: "AI & Smart Agents" },
            { id: "web", label: "Web & 3D Platforms" },
            { id: "mobile", label: "Mobile & Native" },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selectedCategory === tab.id}
              className={`filter-pill ${selectedCategory === tab.id ? "is-active" : ""}`}
              onClick={() => setSelectedCategory(tab.id as ProjectCategory)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="project-card-modern"
                style={{ "--accent": project.accent } as React.CSSProperties}
                data-cursor="explore"
              >
                <div className="pc-glow" aria-hidden="true" />

                <div className="pc-top-bar">
                  <span className="project-status-badge">{project.status}</span>
                  <div className="pc-quick-links">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="pc-icon-link"
                        title="View GitHub Repository"
                        onClick={(e) => e.stopPropagation()}
                      >
                        GitHub ↗
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="pc-icon-link demo-link"
                        title="Open Live Demonstration"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>

                <div
                  className="pc-body-click-target"
                  onClick={() => setSelectedProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                >
                  <h3 className="pc-title">{project.name}</h3>
                  <p className="pc-tagline">{project.tagline}</p>

                  <div className="project-techs pc-tags">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>

                  <div className="pc-details-trigger">
                    <span>Inspect System & Contribution</span>
                    <span className="arrow">→</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* In-depth Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="project-modal-panel glass"
              initial={{ opacity: 0, scale: 0.88, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ "--accent": selectedProject.accent } as React.CSSProperties}
            >
              <button
                className="pm-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project modal"
              >
                ✕
              </button>

              <div className="pm-header">
                <span className="project-status-badge">{selectedProject.status}</span>
                <h2>{selectedProject.name}</h2>
                <p className="pm-tagline">{selectedProject.tagline}</p>
              </div>

              <div className="pm-section">
                <h4>System Architecture & Overview</h4>
                <p>{selectedProject.description}</p>
              </div>

              <div className="pm-section">
                <h4>Role & Contribution</h4>
                <p>{selectedProject.contribution}</p>
              </div>

              <div className="pm-section">
                <h4>Technology Stack</h4>
                <div className="project-techs">
                  {selectedProject.technologies.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>

              {(selectedProject.github || selectedProject.demo) && (
                <div className="pm-links">
                  {selectedProject.github && (
                    <a
                      className="btn btn-ghost"
                      href={selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View GitHub Codebase ↗
                    </a>
                  )}
                  {selectedProject.demo && (
                    <a
                      className="btn btn-primary"
                      href={selectedProject.demo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Launch Live Platform ↗
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
export default Projects;
