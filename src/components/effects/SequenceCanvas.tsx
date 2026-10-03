import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { createFramePlayer, FRAME_COUNT } from "../../film/frameSequence";

type SequenceCanvasProps = {
  progressRef: RefObject<number>;
  className?: string;
  onHue?: (h: number, s: number, l: number) => void;
};

/**
 * React shell around the reusable frame player.
 * Progress is read from a ref (written by the scroll timeline), the film
 * draws itself contained + centred, and the player manages all loading.
 */
export function SequenceCanvas({ progressRef, className, onHue }: SequenceCanvasProps) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const readyRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const player = createFramePlayer({
      canvas,
      getProgress: () => progressRef.current ?? 0,
      reduced,
      onReady: () => {
        if (readyRef.current) return;
        readyRef.current = true;
        setReady(true);
      },
      onLoadProgress: (fraction) => {
        if (!readyRef.current) setLoaded(fraction);
      },
      onHue,
    });

    player.initializeFrameSequence();
    return () => player.destroyFrameSequence();
  }, [reduced, progressRef, onHue]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`film-canvas ${className ?? ""}`}
        aria-hidden="true"
        style={{ opacity: ready ? 1 : 0 }}
      />
      {!ready && (
        <div className="film-loader">
          <span>Loading</span>
          <b>{Math.round(loaded * 100)}%</b>
        </div>
      )}
    </>
  );
}
export default SequenceCanvas;
export { FRAME_COUNT };