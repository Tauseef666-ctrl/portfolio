import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { certificates, type Certificate } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";

type CategoryFilter = "all" | "ai" | "simulation" | "course";

export function Certificates() {
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>("all");
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveCert(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeCert ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeCert]);

  const filteredCerts = certificates.filter((cert) => {
    if (selectedFilter === "all") return true;
    const titleLower = cert.title.toLowerCase();
    const skillsLower = cert.skills.map((s) => s.toLowerCase()).join(" ");
    const issuerLower = cert.issuer.toLowerCase();

    if (selectedFilter === "ai") {
      return (
        titleLower.includes("ai") ||
        titleLower.includes("generative") ||
        skillsLower.includes("artificial intelligence") ||
        skillsLower.includes("ai")
      );
    }
    if (selectedFilter === "simulation") {
      return (
        titleLower.includes("simulation") ||
        issuerLower.includes("forage") ||
        issuerLower.includes("deloitte")
      );
    }
    if (selectedFilter === "course") {
      return (
        !titleLower.includes("simulation") &&
        !titleLower.includes("hackathon") &&
        !issuerLower.includes("forage")
      );
    }
    return true;
  });

  return (
    <section id="certificates" className="section certificates-section">
      <div className="container">
        <SectionHeading kicker="Credentials" title="Certificates & Accreditations" center />
        <p className="cert-note">
          Verified certificates from industry simulations, hackathons, and technology specializations. Click any card to inspect or open the verified document.
        </p>

        {/* Filter Pills */}
        <div className="filter-pill-row" role="tablist" aria-label="Certificate categories">
          {[
            { id: "all", label: `All (${certificates.length})` },
            { id: "ai", label: "Artificial Intelligence" },
            { id: "simulation", label: "Job Simulations" },
            { id: "course", label: "Courses & Specializations" },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selectedFilter === tab.id}
              className={`filter-pill ${selectedFilter === tab.id ? "is-active" : ""}`}
              onClick={() => setSelectedFilter(tab.id as CategoryFilter)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Certificate Cards Grid */}
        <div className="cert-grid">
          <AnimatePresence mode="popLayout">
            {filteredCerts.map((cert, i) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <div
                  className="cert-card interactive-card"
                  style={{ "--accent": cert.accent } as React.CSSProperties}
                  onClick={() => setActiveCert(cert)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveCert(cert);
                    }
                  }}
                  data-cursor="inspect"
                >
                  <div className="cc-glow" aria-hidden="true" />
                  <div className="cc-header">
                    <span className="cc-issuer">{cert.issuer}</span>
                    {cert.date && <span className="cc-date">{cert.date}</span>}
                  </div>

                  <h3 className="cc-title">{cert.title}</h3>

                  {cert.skills.length > 0 && (
                    <div className="cc-tags">
                      {cert.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="cc-skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="cc-footer">
                    <span className="cc-view-action">
                      Inspect Certificate <span className="arrow">↗</span>
                    </span>
                    {cert.verify && (
                      <span className="cc-badge-indicator" title="Verified Badge">
                        Verified ✓
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Interactive Certificate Modal */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            className="cert-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveCert(null)}
          >
            <motion.div
              className="cert-modal-panel glass"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ "--accent": activeCert.accent } as React.CSSProperties}
            >
              <button
                className="cert-modal-close"
                onClick={() => setActiveCert(null)}
                aria-label="Close certificate preview"
              >
                ✕
              </button>

              <div className="cert-modal-header">
                <span className="cc-issuer">{activeCert.issuer}</span>
                <h2>{activeCert.title}</h2>
                {activeCert.date && <span className="cert-modal-date">{activeCert.date}</span>}
              </div>

              {activeCert.skills.length > 0 && (
                <div className="cert-modal-skills">
                  <span className="cert-modal-subtitle">Skills Covered:</span>
                  <div className="project-techs">
                    {activeCert.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Window or Document Launcher */}
              <div className="cert-modal-preview-box">
                {activeCert.file.endsWith(".jpg") ||
                activeCert.file.endsWith(".png") ||
                activeCert.file.endsWith(".webp") ? (
                  <img
                    src={activeCert.file}
                    alt={activeCert.title}
                    className="cert-modal-image"
                  />
                ) : (
                  <div className="cert-modal-pdf-placeholder">
                    <span className="pdf-icon">📄</span>
                    <p>PDF Certificate Document</p>
                    <span className="pdf-filename">{activeCert.file.split("/").pop()}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="cert-modal-actions">
                <a
                  className="btn btn-primary"
                  href={activeCert.file}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Original Document ↗
                </a>

                {activeCert.verify && (
                  <a
                    className="btn btn-ghost"
                    href={activeCert.verify}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Verify Credly Badge ↗
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
export default Certificates;
