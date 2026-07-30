import { useEffect, useId, useRef, useState } from "react";
import { useInView } from "framer-motion";

type Blob = { cx: number; cy: number; r: number; delay: number };

/* Splatter layout in a 0..100 space — union covers the whole box */
const BLOBS: Blob[] = [
  { cx: 48, cy: 46, r: 46, delay: 0 },
  { cx: 22, cy: 26, r: 34, delay: 60 },
  { cx: 76, cy: 28, r: 34, delay: 110 },
  { cx: 18, cy: 74, r: 34, delay: 170 },
  { cx: 80, cy: 76, r: 34, delay: 220 },
  { cx: 50, cy: 12, r: 28, delay: 280 },
  { cx: 50, cy: 90, r: 28, delay: 320 },
  { cx: 6, cy: 50, r: 26, delay: 360 },
  { cx: 94, cy: 50, r: 26, delay: 380 },
];

const DURATION = 1100;

/**
 * Ink-splatter reveal — the content is masked by growing organic ink blots
 * (SVG circles roughened by a turbulence displacement filter).
 * Replays every time the block enters the viewport.
 */
export function InkReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const maskId = `ink-mask-${uid}`;
  const filterId = `ink-rough-${uid}`;

  // "run" restarts the animation, "done" drops the mask so nothing stays clipped
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) {
      setDone(false);
      return;
    }
    setDone(false);
    setRun((k) => k + 1);
    const t = window.setTimeout(() => setDone(true), DURATION + 500);
    return () => window.clearTimeout(t);
  }, [inView]);

  const masked = !done;

  return (
    <div
      ref={ref}
      className={className}
      style={
        masked
          ? ({
              WebkitMaskImage: `url(#${maskId})`,
              maskImage: `url(#${maskId})`,
              mask: `url(#${maskId})`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter id={filterId} x="-35%" y="-35%" width="170%" height="170%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035 0.045"
              numOctaves="4"
              seed="11"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="26"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <mask
            id={maskId}
            maskUnits="objectBoundingBox"
            maskContentUnits="objectBoundingBox"
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              width="1"
              height="1"
            >
              <g filter={`url(#${filterId})`} fill="#fff">
                {BLOBS.map((b, i) => (
                  <circle
                    key={`${run}-${i}`}
                    className="ink-blob"
                    cx={b.cx}
                    cy={b.cy}
                    r={0}
                    style={
                      {
                        "--ink-r": `${b.r}`,
                        animationDelay: `${b.delay}ms`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </g>
            </svg>
          </mask>
        </defs>
      </svg>
      {children}
    </div>
  );
}
