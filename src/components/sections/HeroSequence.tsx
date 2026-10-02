import { motion } from "framer-motion";
import { profile } from "../../data/profile";
import { useApp } from "../../hooks/useApp";
import { InteractiveName } from "../effects/InteractiveName";
import { MagneticButton } from "../ui/MagneticButton";

export function HeroSequence() {
  const { scrollTo } = useApp();

  return (
    <section id="home" className="home-hero">
      <div className="home-hero-inner">
        <motion.div
          className="hero-kicker-badge"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="hero-badge-dot" />
          SCROLL-DRIVEN FILM · THIS PAGE IS LIVE
        </motion.div>

        <InteractiveName name="TAUSEEF KHAN" />

        <motion.div
          className="hero-roles-pills"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          {profile.roles.map((role) => (
            <span key={role} className="hero-role-pill">
              {role}
            </span>
          ))}
        </motion.div>

        <motion.p
          className="hero-philosophy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          «{profile.heroIntro}»
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <MagneticButton className="btn btn-primary" onClick={() => scrollTo("#projects")}>
            Explore Projects ↓
          </MagneticButton>
          <MagneticButton className="btn btn-secondary" onClick={() => scrollTo("#certificates")}>
            Credentials (12) ↗
          </MagneticButton>
          <MagneticButton className="btn btn-ghost" onClick={() => scrollTo("#contact")}>
            Let&apos;s Connect
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div
        className="home-hero-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        aria-hidden="true"
      >
        <div className="mouse-wheel-icon">
          <div className="wheel-ball" />
        </div>
        <span>SCROLL — DRIVE THE FILM</span>
      </motion.div>
    </section>
  );
}
export default HeroSequence;