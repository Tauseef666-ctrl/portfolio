import { motion } from "framer-motion";
import { aiInterests } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";
import { NeuralCanvas } from "../../components/three/NeuralCanvas";

export function AI() {
  return (
    <section id="ai" className="section">
      <div className="container">
        <SectionHeading kicker="AI" title="Exploring AI" />

        <div className="ai-grid">
          <Reveal>
            <div className="ai-canvas-wrap">
              <NeuralCanvas />
            </div>
          </Reveal>

          <div>
            <p style={{ color: "var(--text-dim)", marginBottom: 26, maxWidth: "44ch" }}>
              AI is one of the most exciting areas of technology right now. I spend time
              experimenting with AI tools, learning how to guide models with good prompts,
              and exploring how automation and AI can make building things easier and faster.
            </p>
            <ul className="ai-list">
              {aiInterests.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="ai-node" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
