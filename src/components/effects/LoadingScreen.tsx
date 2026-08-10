import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile } from "../../data/profile";

const logs = [
  "Calibrating perspective",
  "Loading skills database",
  "Indexing project universe",
  "Running usability checks",
  "Waking the AI",
  "Perspective ready",
];

const RING_R = 54;
const RING_C = 2 * Math.PI * RING_R;

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const intervalRef = useRef(0);

  useEffect(() => {
    let value = 0;
    const id = window.setInterval(() => {
      value = Math.min(100, value + Math.random() * 9 + 3);
      setProgress(Math.floor(value));
      if (value >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => setVisible(false), 500);
        window.setTimeout(onDone, 1050);
      }
    }, 130);
    intervalRef.current = id;
    return () => window.clearInterval(id);
  }, [onDone]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % profile.roles.length);
    }, 750);
    return () => window.clearInterval(id);
  }, []);

  const dashOffset = RING_C * (1 - progress / 100);
  const letters = profile.shortName.split("");

  return (
    <motion.div
      className="loading"
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="loading-orb" aria-hidden="true">
        <div className="loading-orb-core" />
      </div>

      <div className="loading-center">
        <div className="loading-status">
          <span className="loading-blink" />
          POWERING UP
        </div>

        <motion.h1
          className="loading-name"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
          aria-label={profile.shortName}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              variants={{
                hidden: { opacity: 0, y: 26, rotateX: 90 },
                show: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 220, damping: 18 } },
              }}
              className={letter === "." ? "loading-dot" : undefined}
            >
              {letter}
            </motion.span>
          ))}
          <span className="loading-shine" aria-hidden="true" />
        </motion.h1>

        <div className="loading-role">
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {profile.roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="loading-ring-wrap">
          <svg className="loading-ring" width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={RING_R} className="loading-ring-bg" />
            <circle
              cx="64"
              cy="64"
              r={RING_R}
              className="loading-ring-fg"
              strokeDasharray={RING_C}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="loading-pct">{progress}%</div>
        </div>

        <div className="loading-logs">
          {logs.map((log, i) => {
            const done = progress >= (i + 1) * (100 / logs.length);
            return (
              <motion.div
                key={log}
                className={`loading-log ${done ? "done" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: done ? 1 : 0.25 }}
                transition={{ duration: 0.3 }}
              >
                <span className="loading-check">{done ? "✓" : "•"}</span>
                {log}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
