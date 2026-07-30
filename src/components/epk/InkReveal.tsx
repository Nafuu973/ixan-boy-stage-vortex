import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const DURATION = 1600;

/**
 * Ink-splatter transition — dark ink blots splash across the block, cover it,
 * then bleed away to reveal the content. Uses animated CSS radial-gradient
 * masks (SVG `mask: url(#id)` on HTML is Firefox-only, so it cannot be used).
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
  const inView = useInView(ref, { amount: 0.2 });

  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setRun((k) => k + 1);
    setPlaying(true);
    const t = window.setTimeout(() => setPlaying(false), DURATION + 200);
    return () => window.clearTimeout(t);
  }, [inView]);

  const variant = run % 2 === 0 ? "a" : "b";

  return (
    <div ref={ref} className={`ink-reveal ink-reveal-host ${className}`}>
      {playing && (
        <>
          <svg aria-hidden width="0" height="0" className="absolute">
            <defs>
              <filter id="ink-rough" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.012 0.018"
                  numOctaves="4"
                  seed="7"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="34"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
          </svg>
          <div aria-hidden className={`ink2 ink2-${variant}`}>
            <div className="ink2-inner" />
          </div>
        </>
      )}
      <div className={playing ? `ink-content ink-content-${variant}` : undefined}>
        {children}
      </div>
    </div>
  );
}
