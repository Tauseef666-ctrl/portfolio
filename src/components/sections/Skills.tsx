import { motion } from "framer-motion";
import { skillGroups, tools } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { TiltCard } from "../../components/ui/TiltCard";
import { Reveal } from "../../components/ui/Reveal";

export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading kicker="Skills" title="Explore My Skills" center />

        <div className="skills-group">
          {skillGroups.map((group, gi) => (
            <Reveal key={group.id} delay={gi * 0.12}>
              <TiltCard className="skill-card">
                <div className="skill-card-inner" style={{ ["--accent" as string]: group.accent }}>
                  <div className="skill-icon">{group.icon}</div>
                  <h3>{group.label}</h3>
                  <ul className="skill-list">
                    {group.skills.map((skill) => (
                      <li key={skill.name}>
                        <span>
                          {skill.name}
                          <span className="skill-note">{skill.note}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="tools-title">Tools & Technologies</div>
        </Reveal>
        <div className="tools-cloud">
          {tools.map((tool, i) => (
            <motion.span
              key={tool}
              className="tool-chip"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3.5 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.12,
              }}
            >
              {tool}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
