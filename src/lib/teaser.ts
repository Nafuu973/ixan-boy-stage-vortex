// Global background teaser player — "Reclaim The Fire" loop.
// Cross-browser (Chrome, Safari iOS/macOS, Firefox, Edge, Android).
//
// iOS Safari ignores HTMLMediaElement.volume, so we route the audio through
// a Web Audio GainNode for real volume control + smooth fades everywhere.
// AudioContext is created lazily inside a user gesture (Enter button) to
// satisfy mobile autoplay policies.

import teaserAsset from "@/assets/reclaim-the-fire-teaser.mp3.asset.json";

const TARGET_VOLUME = 0.45;
const FADE_MS = 400;

let audio: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;
let started = false;
let duckCount = 0;
let usingGain = false;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

function ensureAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (audio) return audio;
  const a = new Audio(teaserAsset.url);
  a.loop = true;
  a.preload = "auto";
  a.crossOrigin = "anonymous";
  a.setAttribute("playsinline", "");
  // muted-friendly default; real volume controlled by GainNode below.
  a.volume = 1;
  audio = a;
  return a;
}

function ensureGainGraph() {
  if (usingGain || typeof window === "undefined") return;
  const a = ensureAudio();
  if (!a) return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as WebkitWindow).webkitAudioContext;
    if (!Ctx) return;
    ctx = new Ctx();
    sourceNode = ctx.createMediaElementSource(a);
    gain = ctx.createGain();
    gain.gain.value = 0;
    sourceNode.connect(gain);
    gain.connect(ctx.destination);
    usingGain = true;
  } catch {
    // Fallback: keep using element.volume (works on desktop browsers).
    usingGain = false;
  }
}

function currentGainValue(): number {
  if (usingGain && gain && ctx) return gain.gain.value;
  return audio?.volume ?? 0;
}

function setGainValue(v: number) {
  if (usingGain && gain) {
    gain.gain.value = v;
  } else if (audio) {
    audio.volume = v;
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
      // Snap exact value at end and notify.
      if (gain) gain.gain.setValueAtTime(target, ctx!.currentTime);
      onDone?.();
    }, ms);
    return;
  }

  // requestAnimationFrame fallback for non-Web-Audio paths.
  const a = audio;
  if (!a) return;
  const from = a.volume;
  const start = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - start) / ms);
    a.volume = from + (target - from) * k;
    if (k < 1) {
      requestAnimationFrame(step);
    } else {
      a.volume = target;
      onDone?.();
    }
  };
  requestAnimationFrame(step);
}

export function startTeaser() {
  const a = ensureAudio();
  if (!a) return;
  // MUST be called inside a user gesture for iOS/Safari to allow audio.
  ensureGainGraph();
  if (ctx && ctx.state === "suspended") {
    void ctx.resume().catch(() => undefined);
  }
  started = true;
  setGainValue(0);
  const p = a.play();
  if (p && typeof p.catch === "function") {
    p.catch(() => undefined);
  }
  if (duckCount === 0) fadeTo(TARGET_VOLUME);
}

export function isTeaserStarted() {
  return started;
}

export function duckTeaser() {
  duckCount += 1;
  if (!started) return;
  fadeTo(0, FADE_MS, () => {
    if (duckCount > 0 && audio && !audio.paused) {
      audio.pause();
    }
  });
}

export function unduckTeaser() {
  duckCount = Math.max(0, duckCount - 1);
  if (duckCount > 0 || !started || !audio) return;
  if (ctx && ctx.state === "suspended") {
    void ctx.resume().catch(() => undefined);
  }
  // Start from silence then fade back up so the resume isn't abrupt.
  setGainValue(0);
  const p = audio.play();
  if (p && typeof p.catch === "function") p.catch(() => undefined);
  fadeTo(TARGET_VOLUME);
}

// Pause/resume on tab visibility — saves battery on mobile, also avoids the
// teaser blasting when the user comes back after a long time.
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!started || !audio) return;
    if (document.hidden) {
      audio.pause();
    } else if (duckCount === 0) {
      const p = audio.play();
      if (p && typeof p.catch === "function") p.catch(() => undefined);
    }
  });
}

// Silence unused-import lint without changing the surface.
export const __ping = () => currentGainValue();
