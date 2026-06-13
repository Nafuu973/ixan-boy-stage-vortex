// Global background teaser player — "Reclaim The Fire" loop.
// Plays at low ambient volume during the whole visit, ducks out smoothly
// when a Signature Track is playing, and resumes from its last position.

import teaserAsset from "@/assets/reclaim-the-fire-teaser.mp3.asset.json";

const TARGET_VOLUME = 0.45;
const FADE_MS = 400;

let audio: HTMLAudioElement | null = null;
let started = false;
let duckCount = 0; // how many things are currently requesting the teaser be quiet
let fadeRaf = 0;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (audio) return audio;
  audio = new Audio(teaserAsset.url);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;
  audio.crossOrigin = "anonymous";
  return audio;
}

function fadeTo(target: number, ms = FADE_MS, onDone?: () => void) {
  const a = getAudio();
  if (!a) return;
  cancelAnimationFrame(fadeRaf);
  const from = a.volume;
  const start = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - start) / ms);
    a.volume = from + (target - from) * k;
    if (k < 1) {
      fadeRaf = requestAnimationFrame(step);
    } else {
      a.volume = target;
      onDone?.();
    }
  };
  fadeRaf = requestAnimationFrame(step);
}

export function startTeaser() {
  const a = getAudio();
  if (!a) return;
  started = true;
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
  const a = getAudio();
  if (!a || !started) return;
  fadeTo(0, FADE_MS, () => {
    if (duckCount > 0) a.pause();
  });
}

export function unduckTeaser() {
  duckCount = Math.max(0, duckCount - 1);
  if (duckCount > 0) return;
  const a = getAudio();
  if (!a || !started) return;
  const p = a.play();
  if (p && typeof p.catch === "function") p.catch(() => undefined);
  fadeTo(TARGET_VOLUME);
}
