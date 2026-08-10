import { achievements } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";

export function Achievements() {
  return (
    <section id="achievements" className="section">
      <div className="container">
        <SectionHeading kicker="Achievements" title="Milestones & Certifications" />

        <div className="achievements-grid">
          {achievements.map((ach, i) => (
            <Reveal key={ach.title} delay={i * 0.1}>
              <div className={`achievement-card ${ach.filled ? "filled" : ""}`}>
                <span className="ach-icon">{ach.filled ? "★" : "⊕"}</span>
                <h3>{ach.title}</h3>
                <p>{ach.hint}</p>
                {!ach.filled && (
                  <span className="ach-edit">Edit in src/data/profile.ts</span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
