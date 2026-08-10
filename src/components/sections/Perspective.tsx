import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { perspective } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";

const chips = [
  { label: "Understand", top: "8%", left: "6%" },
  { label: "Design", top: "22%", left: "86%" },
  { label: "Experiment", top: "48%", left: "2%" },
  { label: "Build", top: "70%", left: "90%" },
  { label: "Learn", top: "86%", left: "34%" },
];

export function Perspective() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const visualY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const ringRotateSmall = useTransform(scrollYProgress, [0, 1], [180, 360]);

  return (
    <section id="perspective" className="section">
      <div className="container">
        <SectionHeading kicker="Perspective" title={perspective.heading} />

        <div className="perspective-grid">
          <motion.div style={{ y: textY }}>
            <Reveal>
              <p className="perspective-body">{perspective.body}</p>
            </Reveal>
          </motion.div>

          <motion.div ref={ref} className="perspective-visual" style={{ y: visualY }}>
            <motion.div className="ring3d large" style={{ rotate: ringRotate }} />
            <motion.div
              className="ring3d small"
              style={{ rotate: ringRotateSmall }}
            />
            {chips.map((chip, i) => (
              <span
                key={chip.label}
                style={{
                  position: "absolute",
                  top: chip.top,
                  left: chip.left,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.span
                  className="perspective-chip"
                  style={{ display: "inline-block" }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  }}
                >
                  {chip.label}
                </motion.span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
