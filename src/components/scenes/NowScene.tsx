import { journey } from "../../data/profile";
import { useSceneFX } from "../../hooks/useSceneFX";

const currentFocus = ["EduPath AI — adaptive learning agent", "T2S Study Together — mobile app", "This portfolio — v3 scroll film"];

export function NowScene() {
  const ref = useSceneFX<HTMLElement>();

  return (
    <section id="now" ref={ref} className="scene now">
      <div className="container">
        <div className="scene-head" data-reveal>
          <div className="scene-num">SCENE 07</div>
          <div className="scene-eyebrow">The Road</div>
          <h2 className="scene-title">Where it&apos;s heading.</h2>
        </div>

        <div className="now-path">
          {journey.map((stage, i) => (
            <div key={stage.stage} className="now-stage" data-reveal>
              <div className="now-stage-num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{stage.stage}</h3>
              <p>{stage.note}</p>
            </div>
          ))}
        </div>

        <div className="now-focus" data-reveal>
          <span className="now-focus-label">Currently working on</span>
          {currentFocus.map((item) => (
            <span key={item} className="now-focus-chip">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
export default NowScene;