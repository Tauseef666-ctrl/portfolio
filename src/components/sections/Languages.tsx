import { languages } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";

export function Languages() {
  return (
    <section id="languages" className="section">
      <div className="container">
        <SectionHeading kicker="Languages & Tools" title="Everything I Work With" center />
        <p className="cert-note" style={{ textAlign: "center" }}>
          All the languages and technologies from my GitHub profile and repositories.
        </p>

        <div className="languages-grid">
          {languages.map((lang, i) => (
            <Reveal key={lang.name} delay={i * 0.06}>
              <div
                className="language-card"
                style={{ "--accent": lang.accent } as React.CSSProperties}
              >
                <div className="lc-glow" aria-hidden="true" />
                <span className="lc-name">{lang.name}</span>
                <p className="lc-note">{lang.note}</p>
                <span className="project-techs">
                  {lang.usage.map((u) => (
                    <span key={u}>{u}</span>
                  ))}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}