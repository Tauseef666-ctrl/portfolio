import { about, perspective } from "../../data/profile";
import { useSceneFX } from "../../hooks/useSceneFX";

export function StoryScene() {
  const ref = useSceneFX<HTMLElement>();

  return (
    <section id="story" ref={ref} className="scene story">
      <div className="container">
        <div className="scene-head" data-reveal>
          <div className="scene-num">SCENE 02</div>
          <div className="scene-eyebrow">The Story</div>
        </div>

        <p className="story-statement" data-reveal>
          {about.bio}
        </p>

        <div className="story-grid">
          <div className="story-body" data-reveal>
            <p>
              <strong>{perspective.heading}.</strong> {perspective.body}
            </p>
          </div>
          <div className="story-drives" data-reveal>
            {about.interests.map((interest) => (
              <div key={interest} className="story-drive">
                {interest}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export default StoryScene;