import { useEffect, useRef, useState } from "react";
import { attachLiveAudio } from "@/lib/pulse";

export function TrackPlayer({ src, title }: { src?: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const attachedRef = useRef(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress(a.currentTime / (a.duration || 1));
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a || !src) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      if (!attachedRef.current) {
        attachLiveAudio(a);
        attachedRef.current = true;
      }
      try {
        await a.play();
        setPlaying(true);
      } catch {
        // ignore
      }
    }
  };

  // 36 vertical bars — heights driven by --pulse + index sin
  const bars = Array.from({ length: 36 });

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          disabled={!src}
          className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-violet/40 bg-violet/10 text-bone transition-all hover:bg-violet hover:shadow-[0_0_30px_var(--violet)] disabled:opacity-40"
        >
          {playing ? (
            <span className="flex gap-1">
              <span className="h-3 w-1 bg-bone" />
              <span className="h-3 w-1 bg-bone" />
            </span>
          ) : (
            <span className="ml-0.5 h-0 w-0 border-y-[7px] border-l-[10px] border-y-transparent border-l-bone" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex h-12 items-end gap-[2px]">
            {bars.map((_, i) => (
              <span
                key={i}
                className="flex-1 origin-bottom bg-gradient-to-t from-violet/40 to-violet"
                style={{
                  height: `calc(${20 + Math.abs(Math.sin(i * 0.6)) * 60}% * (0.5 + var(--pulse) * 1.2))`,
                  opacity: i / 36 < progress ? 1 : 0.25,
                  transition: "opacity 0.15s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {src && (
        <audio ref={audioRef} src={src} preload="none" crossOrigin="anonymous" />
      )}
      {!src && (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Audio à brancher · placeholder
        </p>
      )}
    </div>
  );
}
