import { motion } from "framer-motion";
import { journey } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";

export function Journey() {
  return (
    <section id="journey" className="section">
      <div className="container">
        <SectionHeading kicker="Journey" title="My Learning Path" center />

        <div className="timeline">
          {journey.map((step, i) => (
            <motion.div
              key={step.stage}
              className="timeline-item"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="timeline-dot" />
              <span className="timeline-num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="timeline-stage">
                <span className="gradient-text">{step.stage}</span>
              </h3>
              <p className="timeline-note">{step.note}</p>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: "0.86rem", marginTop: 40 }}>
            Every stage is still in progress — that's the point of learning.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
