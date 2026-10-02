import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "../../hooks/useApp";

const scenes = [
  { id: "intro", label: "Intro" },
  { id: "story", label: "Story" },
  { id: "craft", label: "Craft" },
  { id: "work", label: "Work" },
  { id: "proof", label: "Proof" },
  { id: "explore", label: "Explore" },
  { id: "now", label: "Now" },
  { id: "reach", label: "Reach" },
];

export function Navbar() {
  const { scrollTo } = useApp();
  const [active, setActive] = useState("intro");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    scenes.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="nav-wrap">
        <div className="nav">
          <button className="nav-brand" onClick={() => go("intro")} aria-label="Back to the start">
            <span className="nav-brand-dot" />
            <span>TAUSEEF.KHAN</span>
          </button>

          <nav className="nav-links" aria-label="Scene navigation">
            {scenes.map((scene) => (
              <button
                key={scene.id}
                className={`nav-link ${active === scene.id ? "active" : ""}`}
                onClick={() => go(scene.id)}
              >
                {scene.label}
              </button>
            ))}
          </nav>

          <button
            className={`nav-burger ${open ? "open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Mobile navigation" className="mobile-nav-inner">
              {scenes.map((scene, i) => (
                <motion.button
                  key={scene.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                  className={`mobile-nav-link ${active === scene.id ? "active" : ""}`}
                  onClick={() => go(scene.id)}
                >
                  <span className="mobile-link-dot" />
                  <span>{scene.label}</span>
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