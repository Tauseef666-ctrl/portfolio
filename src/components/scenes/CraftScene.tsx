import type { CSSProperties } from "react";
import { languages, skillGroups, tools } from "../../data/profile";
import { useSceneFX } from "../../hooks/useSceneFX";

export function CraftScene() {
  const ref = useSceneFX<HTMLElement>();

  return (
    <section id="craft" ref={ref} className="scene craft">
      <div className="container">
        <div className="scene-head" data-reveal>
          <div className="scene-num">SCENE 03</div>
          <div className="scene-eyebrow">The Craft</div>
          <h2 className="scene-title">A working stack.</h2>
        </div>

        <div className="craft-pillars">
          {skillGroups.map((group, i) => (
            <div
              key={group.id}
              className="craft-pillar"
              data-reveal
              style={{ "--pillar-accent": group.accent } as CSSProperties}
            >
              <div className="craft-pillar-head">
                <div className="craft-pillar-icon">{group.icon}</div>
                <div className="craft-pillar-label">{group.label}</div>
              </div>
              {group.skills.map((skill) => (
                <div key={skill.name} className="craft-pillar-item">
                  <strong>{skill.name}</strong>
                  <span>{skill.note}</span>
                </div>
              ))}
              <div className="craft-pillar-idx mono">{String(i + 1).padStart(2, "0")}</div>
            </div>
          ))}
        </div>

        <div className="craft-langs-label" data-reveal>
          Languages & frameworks — hover for detail
        </div>
        <div className="craft-langs">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="craft-lang"
              style={{ "--lang-accent": lang.accent } as CSSProperties}
            >
              {lang.name}
              <span className="lang-note">
                <strong style={{ display: "block", marginBottom: 4 }}>{lang.name}</strong>
                {lang.note}
                {lang.usage.length > 0 && (
                  <span className="lang-usage"> — {lang.usage.join(" · ")}</span>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="craft-langs-label" data-reveal>
          Everyday tools
        </div>
        <div className="craft-tools" data-reveal>
          {tools.map((tool) => (
            <span key={tool} className="craft-tool">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
export default CraftScene;