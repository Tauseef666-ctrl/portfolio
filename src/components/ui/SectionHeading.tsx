import { Reveal } from "./Reveal";

export function SectionHeading({
  kicker,
  title,
  center,
}: {
  kicker: string;
  title: string;
  center?: boolean;
}) {
  return (
    <Reveal>
      <div style={{ textAlign: center ? "center" : "left", marginBottom: "clamp(34px, 6vh, 60px)" }}>
        <span
          className="section-kicker"
          style={center ? { justifyContent: "center" } : undefined}
        >
          {kicker}
        </span>
        <h2 className="section-title">{title}</h2>
      </div>
    </Reveal>
  );
}
