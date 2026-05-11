import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function RevealText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        return (
          <motion.span key={i} style={{ opacity }} className="inline-block">
            {w}&nbsp;
          </motion.span>
        );
      })}
    </span>
  );
}
