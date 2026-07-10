// Global background teaser — now driven by the "Matière Sonore" video.
// The video element lives inside the SignatureTracks section and registers
// itself here on mount. The Enter button on the intro overlay calls
// startTeaser(), which unmutes + plays the video (satisfying autoplay policies
// via the user gesture) and routes its audio through a Web Audio graph so we
// can smoothly duck/unduck when a signature track plays.

const TARGET_VOLUME = 0.55;
const FADE_MS = 400;

let video: HTMLVideoElement | null = null;
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;
let analyserNode: AnalyserNode | null = null;
let started = false;
let duckCount = 0;
let usingGain = false;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

export function registerTeaserVideo(el: HTMLVideoElement | null) {
  if (!el || video === el) return;
  video = el;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  // Muted by default so the element can render / preload without audio;
  // startTeaser() unmutes inside the user gesture.
  video.muted = true;
  video.preload = "auto";
}

function ensureGainGraph() {
  if (usingGain || typeof window === "undefined" || !video) return;
  try {
    const Ctx = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
    if (!Ctx) return;
    ctx = new Ctx();
    sourceNode = ctx.createMediaElementSource(video);
    gain = ctx.createGain();
    gain.gain.value = 0;
    analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 2048;
    analyserNode.smoothingTimeConstant = 0.8;
    sourceNode.connect(analyserNode);
    analyserNode.connect(gain);
    gain.connect(ctx.destination);
    usingGain = true;
  } catch {
    usingGain = false;
  }
}

function setGainValue(v: number) {
  if (usingGain && gain) {
    gain.gain.value = v;
  } else if (video) {
    video.volume = v;
  }
}

function fadeTo(target: number, ms = FADE_MS, onDone?: () => void) {
  if (usingGain && gain && ctx) {
    const now = ctx.currentTime;
    const from = gain.gain.value;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(from, now);
    gain.gain.linearRampToValueAtTime(target, now + ms / 1000);
    window.setTimeout(() => {
      if (gain && ctx) gain.gain.setValueAtTime(target, ctx.currentTime);
      onDone?.();
    }, ms);
    return;
  }
  const v = video;
  if (!v) return;
  const from = v.volume;
  const start = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - start) / ms);
    v.volume = from + (target - from) * k;
    if (k < 1) requestAnimationFrame(step);
    else {
      v.volume = target;
      onDone?.();
    }
  };
  requestAnimationFrame(step);
}

export function startTeaser() {
  if (!video) return;
  ensureGainGraph();
  if (ctx && ctx.state === "suspended") {
    void ctx.resume().catch(() => undefined);
  }
  started = true;
  video.muted = false;
  setGainValue(0);
  const p = video.play();
  if (p && typeof p.catch === "function") p.catch(() => undefined);
  if (duckCount === 0) fadeTo(TARGET_VOLUME);
}

export function isTeaserStarted() {
  return started;
}

export function duckTeaser() {
  duckCount += 1;
  if (!started || !video) return;
  fadeTo(0, FADE_MS, () => {
    if (duckCount > 0 && video) {
      // Keep the picture running (loop background), just mute at graph level.
      // Nothing else to do — gain is already at 0.
    }
  });
}

export function unduckTeaser() {
  duckCount = Math.max(0, duckCount - 1);
  if (duckCount > 0 || !started || !video) return;
  if (ctx && ctx.state === "suspended") {
    void ctx.resume().catch(() => undefined);
  }
  setGainValue(0);
  const p = video.play();
  if (p && typeof p.catch === "function") p.catch(() => undefined);
  fadeTo(TARGET_VOLUME);
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!started || !video) return;
    if (document.hidden) {
      video.pause();
    } else if (duckCount === 0) {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => undefined);
    }
  });
}

export function getTeaserAnalyser(): AnalyserNode | null {
  return analyserNode;
}
