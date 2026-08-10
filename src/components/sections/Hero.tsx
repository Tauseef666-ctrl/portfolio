import { motion, type Variants } from "framer-motion";
import { lazy, Suspense } from "react";
import { profile } from "../../data/profile";
import { useApp } from "../../hooks/useApp";
import { MagneticButton } from "../../components/ui/MagneticButton";
import { useIsTouch } from "../../hooks/useIsTouch";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const HeroOrb = lazy(() => import("../../components/three/HeroOrb"));

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const { scrollTo } = useApp();
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();

  return (
    <section id="home" className="hero container">
      <motion.div
        className="hero-content"
        variants={container}
        initial={reduced ? false : "hidden"}
        animate="show"
      >
        <motion.div variants={item} className="hero-kicker">
          Enter My Perspective
        </motion.div>

        <motion.h1 variants={item} className="hero-name">
          <span className="gradient-text">{profile.name}</span>
        </motion.h1>

        <motion.div variants={item} className="hero-roles">
          {profile.roles.map((role) => (
            <span key={role} className="hero-role">
              {role}
            </span>
          ))}
        </motion.div>

        <motion.p variants={item} className="hero-intro">
          «{profile.heroIntro}»
        </motion.p>

        <motion.div variants={item} className="hero-cta">
          <MagneticButton
            className="btn btn-primary"
            onClick={() => scrollTo("#projects")}
          >
            Explore My Work
          </MagneticButton>
          <MagneticButton
            className="btn btn-ghost"
            onClick={() => scrollTo("#skills")}
          >
            View Skills
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-canvas"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense
          fallback={
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
                color: "rgba(238,242,255,0.35)",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.2em",
                fontSize: "0.8rem",
              }}
            >
              LOADING PERSPECTIVE…
            </div>
          }
        >
          <HeroOrb showLabels={!isTouch} />
        </Suspense>
      </motion.div>

      <div className="scroll-hint" aria-hidden="true">
        <div className="wheel" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
