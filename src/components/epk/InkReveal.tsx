import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const DURATION = 1400;

/**
 * Ink-splatter reveal — the content is uncovered by growing organic ink blots.
 * Implemented with animated CSS radial-gradient mask layers (works in every
 * browser, unlike SVG `mask: url(#id)` on HTML which is Firefox-only).
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
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) {
      setDone(false);
      return;
    }
    setDone(false);
    setRun((k) => k + 1);
    const t = window.setTimeout(() => setDone(true), DURATION + 200);
    return () => window.clearTimeout(t);
  }, [inView]);

  return (
    <div
      ref={ref}
      className={`${done ? "" : run % 2 === 0 ? "ink-reveal-a" : "ink-reveal-b"} ${className}`}
    >
      {children}
    </div>
  );
}
