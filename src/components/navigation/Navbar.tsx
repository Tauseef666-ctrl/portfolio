import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "../../hooks/useApp";

const links = [
  { id: "home", label: "Home" },
  { id: "perspective", label: "Perspective" },
  { id: "skills", label: "Skills" },
  { id: "languages", label: "Tech" },
  { id: "projects", label: "Projects" },
  { id: "testing", label: "QA Lab" },
  { id: "ai", label: "AI" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "certificates", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const { scrollTo } = useApp();
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <header className="nav-wrap">
        <div className="nav-container">
          <button
            className="nav-brand-button"
            onClick={() => go("home")}
            aria-label="Back to top"
          >
            <span className="brand-dot" />
            <span className="brand-title">TAUSEEF KHAN</span>
          </button>

          <nav className="nav" aria-label="Primary Navigation">
            {links.map((link) => (
              <button
                key={link.id}
                className={`nav-link ${active === link.id ? "active" : ""}`}
                onClick={() => go(link.id)}
              >
                {active === link.id && (
                  <motion.span
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="nav-label-text">{link.label}</span>
              </button>
            ))}
          </nav>

          <button
            className={`nav-burger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Mobile Navigation" className="mobile-nav-inner">
              {links.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.03 * i, duration: 0.3 }}
                  className={`mobile-nav-link ${active === link.id ? "active" : ""}`}
                  onClick={() => go(link.id)}
                >
                  <span className="mobile-link-dot" />
                  <span>{link.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default Navbar;
