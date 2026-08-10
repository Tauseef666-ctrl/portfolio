import { motion } from "framer-motion";
import { useState } from "react";
import { testingCapabilities, testingDemos } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";

export function Testing() {
  const [squashed, setSquashed] = useState<Record<string, boolean>>({});
  const resolved = Object.values(squashed).filter(Boolean).length;

  return (
    <section id="testing" className="section">
      <div className="container">
        <SectionHeading kicker="Quality & Care" title="Software Testing" />

        <Reveal>
          <div className="lab-panel">
            <div className="lab-grid">
              <div>
                <p style={{ color: "var(--text-dim)", marginBottom: 28, maxWidth: "46ch" }}>
                  I care about how things work, not just how they look. This lab is where I
                  think through what could go wrong, evaluate experiences, and make sure
                  products behave the way they should.
                </p>
                <div className="cap-grid">
                  {testingCapabilities.map((cap, i) => (
                    <motion.div
                      key={cap}
                      className="cap-item"
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="cap-dot" />
                      {cap}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: "1.1rem", color: "var(--text)" }}>Active Issues</h3>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      letterSpacing: "0.14em",
                      color: resolved ? "#34d399" : "var(--text-faint)",
                    }}
                  >
                    {resolved}/{testingDemos.length} RESOLVED
                  </span>
                </div>
                <div className="bug-rack">
                  {testingDemos.map((bug) => {
                    const done = !!squashed[bug.id];
                    return (
                      <motion.button
                        key={bug.id}
                        className={`bug-row ${done ? "squashed" : ""}`}
                        onClick={() =>
                          setSquashed((s) => ({ ...s, [bug.id]: !s[bug.id] }))
                        }
                        data-cursor="open"
                        whileTap={{ scale: 0.99 }}
                        animate={{ x: 0 }}
                        style={{ textAlign: "left" }}
                      >
                        <span className="bug-icon" aria-hidden="true">
                          {done ? "✓" : "🐞"}
                        </span>
                        <span className="bug-info">
                          <strong>{bug.label}</strong>
                          <span>{bug.detail}</span>
                        </span>
                        <span className="bug-state">{done ? "Resolved" : "Open"}</span>
                      </motion.button>
                    );
                  })}
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-faint)", marginTop: 14 }}>
                  Tap an issue to resolve it. These are interactive demos, not real defects.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
