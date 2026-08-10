import { useState } from "react";
import { about } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { TiltCard } from "../../components/ui/TiltCard";
import { Reveal } from "../../components/ui/Reveal";

export function About() {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading kicker="About" title="Who I Am" />

        <div className="about-grid">
          <Reveal>
            <div className="about-3d">
              <TiltCard className="about-card" maxTilt={10}>
                <div className="about-halo" aria-hidden="true" />
                <div className="about-avatar">
                  {photoFailed ? (
                    <span className="about-avatar-fallback">TK</span>
                  ) : (
                    <img
                      src="/profile.jpg"
                      alt="Portrait of Tauseef Khan"
                      className="about-avatar-img"
                      onError={() => setPhotoFailed(true)}
                    />
                  )}
                </div>
                <h3>Hi, I'm Tauseef Khan</h3>
                <p>{about.bio}</p>
              </TiltCard>
            </div>
          </Reveal>

          <div>
            <p style={{ color: "var(--text-dim)", marginBottom: 8 }}>
              I enjoy exploring different corners of technology — from writing code and
              designing interfaces to breaking things and fixing them again:
            </p>
            <ul className="interests">
              {about.interests.map((interest, i) => (
                <Reveal key={interest} delay={i * 0.06}>
                  <li>{interest}</li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
