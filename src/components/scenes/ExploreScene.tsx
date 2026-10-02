import { achievements, aiInterests, testingCapabilities, testingDemos } from "../../data/profile";
import { useSceneFX } from "../../hooks/useSceneFX";

export function ExploreScene() {
  const ref = useSceneFX<HTMLElement>();

  return (
    <section id="explore" ref={ref} className="scene explore">
      <div className="container">
        <div className="scene-head" data-reveal>
          <div className="scene-num">SCENE 06</div>
          <div className="scene-eyebrow">The Experiments</div>
          <h2 className="scene-title">I also test, break & explore.</h2>
        </div>

        <div className="explore-cols">
          <div data-reveal>
            <div className="explore-block-label">What I test</div>
            <div className="explore-list">
              {testingCapabilities.map((cap, i) => (
                <div key={cap} className="explore-row">
                  <span className="row-idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="row-label">{cap}</span>
                </div>
              ))}
            </div>

            <div className="explore-block-label" style={{ marginTop: 40 }}>
              Bugs I found
            </div>
            <div className="explore-list">
              {testingDemos.map((demo) => (
                <div key={demo.id} className="explore-row">
                  <span className="row-idx">{demo.id}</span>
                  <span className="row-label">{demo.label}</span>
                  <span className="row-detail">{demo.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal>
            <div className="explore-block-label">What I explore</div>
            <div className="explore-list">
              {aiInterests.map((interest, i) => (
                <div key={interest} className="explore-row">
                  <span className="row-idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="row-label">{interest}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="achieve-grid" data-reveal>
          {achievements.map((a) => (
            <div key={a.title} className="achieve-card">
              <h3>{a.title}</h3>
              <p>{a.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default ExploreScene;