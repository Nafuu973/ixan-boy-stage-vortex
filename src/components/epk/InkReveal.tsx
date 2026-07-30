import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";

const DURATION = 1700;

/** Deterministic PRNG so each run is organic but stable across re-renders. */
function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Irregular closed blob path (smooth cubic through jittered polar points). */
function blobPath(cx: number, cy: number, r: number, wobble: number, rand: () => number) {
  const n = 12 + Math.floor(rand() * 5);
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    // occasional long tendril, like ink flicking outward
    const spike = rand() < 0.18 ? 1 + rand() * 0.9 : 1;
    const rr = r * (1 - wobble / 2 + rand() * wobble) * spike;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * (0.85 + rand() * 0.3)]);
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[i];
    const p1 = pts[(i + 1) % n];
    const mx = (p0[0] + p1[0]) / 2;
    const my = (p0[1] + p1[1]) / 2;
    d += ` Q ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  return d + " Z";
}

type Blob = { d: string; delay: number; ox: number; oy: number };

function buildSplat(seed: number): Blob[] {
  const rand = rng(seed);
  const blobs: Blob[] = [];
  // main mass
  blobs.push({ d: blobPath(50, 48, 26, 0.55, rand), delay: 0, ox: 50, oy: 48 });
  // secondary masses
  const secondary = [
    [24, 30],
    [76, 34],
    [30, 70],
    [72, 68],
    [50, 14],
    [50, 86],
  ];
  secondary.forEach(([x, y], i) => {
    blobs.push({
      d: blobPath(x, y, 10 + rand() * 9, 0.7, rand),
      delay: 60 + i * 45 + rand() * 60,
      ox: x,
      oy: y,
    });
  });
  // droplets / spatter
  for (let i = 0; i < 16; i++) {
    const x = 6 + rand() * 88;
    const y = 6 + rand() * 88;
    blobs.push({
      d: blobPath(x, y, 1.2 + rand() * 3.4, 0.9, rand),
      delay: 120 + rand() * 320,
      ox: x,
      oy: y,
    });
  }
  return blobs;
}

/**
 * Ink-splatter transition — real irregular ink blobs (generated paths, roughened
 * by an SVG turbulence displacement) splash across the block, hold, then bleed
 * away to reveal the content. Replays each time the block enters the viewport.
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

  const blobs = useMemo(() => buildSplat(run * 977 + 13), [run]);
  const fid = `ink-rough-${run}`;

  return (
    <div ref={ref} className={`ink-reveal ink-reveal-host ${className}`}>
      {playing && (
        <svg
          key={run}
          aria-hidden
          className="ink-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id={fid} x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" seed={run * 7 + 3} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <g filter={`url(#${fid})`} className="ink-splat">
            {blobs.map((b, i) => (
              <path
                key={i}
                d={b.d}
                className="ink-blob"
                style={{
                  animationDelay: `${b.delay}ms`,
                  transformOrigin: `${b.ox}px ${b.oy}px`,
                }}
              />
            ))}
          </g>
        </svg>
      )}
      <div className={playing ? "ink-content-run" : undefined}>{children}</div>
    </div>
  );
}
