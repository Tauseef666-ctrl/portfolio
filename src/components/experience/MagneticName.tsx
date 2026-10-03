import { useRef, type CSSProperties } from "react";
import { useMagneticName } from "../../hooks/useMagneticName";

type MagneticNameProps = {
  name: string;
  className?: string;
  ariaLabel?: string;
};

/**
 * The identity — set in modest size, never a giant full-screen headline.
 * Each letter is an independent span so the cursor can pull letters toward it
 * (transforms only; no layout shift). Uses the reused `useMagneticName` hook
 * and keeps the `.cinema-name` selector the cursor understands.
 */
export function MagneticName({ name, className, ariaLabel }: MagneticNameProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const cls = ["cinema-name", className].filter(Boolean).join(" ");

  useMagneticName(rootRef, ".cinema-name");

  return (
    <h2 ref={rootRef} className={cls} role="text" aria-label={ariaLabel ?? name}>
      {name.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i} className="cinema-name-space" aria-hidden="true">
            &nbsp;
          </span>
        ) : (
          <span
            key={i}
            className="cinema-name-letter"
            style={{ "--i": i } as CSSProperties}
            aria-hidden="true"
          >
            <span className="cinema-name-char">{ch}</span>
          </span>
        )
      )}
    </h2>
  );
}
export default MagneticName;