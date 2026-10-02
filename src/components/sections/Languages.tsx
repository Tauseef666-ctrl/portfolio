import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { languages } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";

type LangFilter = "all" | "lang" | "framework" | "platform" | "devops";

export function Languages() {
  const [filter, setFilter] = useState<LangFilter>("all");

  const filtered = languages.filter((l) => {
    if (filter === "all") return true;
    const name = l.name.toLowerCase();
    const usage = l.usage.map((u) => u.toLowerCase()).join(" ");

    if (filter === "lang") {
      return ["typescript", "javascript", "python", "kotlin", "java", "html", "css", "shell"].includes(name);
    }
    if (filter === "framework") {
      return ["react", "next.js", "react native", "expo", "three.js", "react three fiber", "framer motion", "tailwind css"].includes(name);
    }
    if (filter === "platform") {
      return ["ollama", "mediapipe", "tauri", "pyodide", "capacitor", "node.js", "android studio"].includes(name);
    }
    if (filter === "devops") {
      return ["git", "github", "vite", "vercel", "netlify"].includes(name);
    }
    return true;
  });

  return (
    <section id="languages" className="section languages-section">
      <div className="container">
        <SectionHeading kicker="Technologies" title="Languages & Tooling Ecosystem" center />
        <p className="cert-note" style={{ textAlign: "center" }}>
          Every technology, runtime, and framework utilized across my projects and open-source repositories.
        </p>

        {/* Filter Pills */}
        <div className="filter-pill-row" role="tablist" aria-label="Technology categories">
          {[
            { id: "all", label: `All (${languages.length})` },
            { id: "lang", label: "Programming Languages" },
            { id: "framework", label: "Frameworks & Libraries" },
            { id: "platform", label: "AI & Native Platforms" },
            { id: "devops", label: "Tooling & Cloud" },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={filter === tab.id}
              className={`filter-pill ${filter === tab.id ? "is-active" : ""}`}
              onClick={() => setFilter(tab.id as LangFilter)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="languages-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((lang, i) => (
              <motion.div
                key={lang.name}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.35, delay: i * 0.02 }}
                className="language-card"
                style={{ "--accent": lang.accent } as React.CSSProperties}
              >
                <div className="lc-glow" aria-hidden="true" />
                <div className="lc-header">
                  <span className="lc-name">{lang.name}</span>
                </div>
                <p className="lc-note">{lang.note}</p>
                <div className="project-techs lc-usage-tags">
                  {lang.usage.map((u) => (
                    <span key={u}>{u}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
export default Languages;