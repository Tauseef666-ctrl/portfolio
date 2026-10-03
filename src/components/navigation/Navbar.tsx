import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ACTS } from "../../data/acts";
import { useApp } from "../../hooks/useApp";

export function Navbar() {
  const { scrollTo, activeAct } = useApp();
  const [open, setOpen] = useState(false);

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

          <nav className="nav-links" aria-label="Act navigation">
            {ACTS.map((act, i) => (
              <button
                key={act.id}
                className={`nav-link ${activeAct === i ? "active" : ""}`}
                onClick={() => go(act.id)}
              >
                {act.label}
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
              {ACTS.map((act, i) => (
                <motion.button
                  key={act.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                  className={`mobile-nav-link ${activeAct === i ? "active" : ""}`}
                  onClick={() => go(act.id)}
                >
                  <span className="mobile-link-dot" />
                  <span>
                    {act.num} · {act.label}
                  </span>
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