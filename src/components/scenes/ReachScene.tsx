import { contact } from "../../data/profile";
import { useSceneFX } from "../../hooks/useSceneFX";
import { MagneticButton } from "../ui/MagneticButton";

export function ReachScene() {
  const ref = useSceneFX<HTMLElement>();

  return (
    <section id="reach" ref={ref} className="scene reach">
      <div className="container">
        <div data-reveal>
          <div className="scene-num">SCENE 08</div>
          <div className="scene-eyebrow">The End</div>
          <h2 className="reach-title">{contact.heading}</h2>
          <p className="reach-note">{contact.note}</p>
          <div className="reach-actions">
            <MagneticButton
              href={`mailto:${contact.email}`}
              className="btn btn-primary"
              strength={0.3}
            >
              Email me
            </MagneticButton>
            {contact.github && (
              <MagneticButton href={contact.github} className="btn" strength={0.3}>
                GitHub ↗
              </MagneticButton>
            )}
            {contact.socials.map((s) => (
              <MagneticButton key={s.href} href={s.href} className="btn" strength={0.3}>
                {s.label} ↗
              </MagneticButton>
            ))}
          </div>
        </div>

        <div className="end-mark" data-reveal>
          <div className="end-mark-name">TAUSEEF.KHAN</div>
          <div className="end-mark-line" />
          <div className="end-mark-sub">Built as a scroll-driven film — React · Vite · GSAP · Lenis</div>
        </div>
      </div>
    </section>
  );
}
export default ReachScene;