import { certificates } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";

export function Certificates() {
  return (
    <section id="certificates" className="section">
      <div className="container">
        <SectionHeading kicker="Certificates" title="Credentials & Training" center />
        <p className="cert-note">
          Verified certificates from job simulations and courses — click any card to view the original.
        </p>

        <div className="cert-grid">
          {certificates.map((cert, i) => (
            <Reveal key={cert.id} delay={i * 0.07}>
              <a
                className="cert-card"
                href={cert.file}
                target="_blank"
                rel="noreferrer"
                style={{ "--accent": cert.accent } as React.CSSProperties}
              >
                <div className="cc-glow" aria-hidden="true" />
                <span className="cc-issuer">{cert.issuer}</span>
                <h3>{cert.title}</h3>
                {cert.date && <span className="cc-date">{cert.date}</span>}
                {cert.skills.length > 0 && (
                  <span className="project-techs">
                    {cert.skills.slice(0, 3).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </span>
                )}
                <span className="cc-view">
                  View certificate <span className="arrow">↗</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
