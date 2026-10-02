import type { CSSProperties } from "react";
import { certificates } from "../../data/profile";
import { useSceneFX } from "../../hooks/useSceneFX";

function monthLabel(date?: string): string {
  if (!date) return "ARCHIVE";
  return date.toUpperCase();
}

export function ProofScene() {
  const ref = useSceneFX<HTMLElement>();

  return (
    <section id="proof" ref={ref} className="scene proof">
      <div className="container">
        <div className="scene-head" data-reveal>
          <div className="scene-num">SCENE 05</div>
          <div className="scene-eyebrow">The Evidence</div>
          <h2 className="scene-title">Proof of learning.</h2>
          <p className="scene-sub">Every certificate is real. Issuer, skills and verification links are preserved below.</p>
        </div>

        <div className="proof-line">
          {certificates.map((cert) => (
            <article
              key={cert.id}
              className="proof-item"
              data-reveal
              style={{ "--proof-accent": cert.accent } as CSSProperties}
            >
              <div className="proof-item-meta">
                <span>{monthLabel(cert.date)}</span>
                <span>·</span>
                <span>{cert.issuer}</span>
              </div>
              <h3 className="proof-item-title">{cert.title}</h3>
              {cert.skills.length > 0 && (
                <div className="proof-item-skills">
                  {cert.skills.map((skill) => (
                    <span key={skill} className="proof-skill">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {(cert.verify || cert.file) && (
                <a
                  className="proof-open"
                  href={cert.verify || cert.file}
                  target="_blank"
                  rel="noreferrer"
                >
                  View certificate →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export default ProofScene;