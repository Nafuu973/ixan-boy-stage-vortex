// Global pulse driver — calm by default, switches to live FFT only while audio plays.
// Drives multiple CSS variables on document root each rAF:
//   --pulse           : smoothed cinematic bass envelope (0..1), slow follow — feeds atmosphere
//   --pulse-kick      : short impulse on SELECTED major kicks only (0..1, fast decay ~0.25s)
//   --pulse-activation: 0→1 ramp on play start (~1.2s ease) and back to 0 on idle
//
// Design intent: the visuals breathe with the music's structure, react only to
// impactful moments, and wake up progressively rather than exploding at t=0.

type Mode = "idle" | "live";

let mode: Mode = "idle";
let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let dataArray: Uint8Array | null = null;
let currentSource: MediaElementAudioSourceNode | null = null;
const sourceNodes = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>();
let rafId = 0;
let started = false;

// Envelopes
let energy = 0;          // smoothed bass envelope (0..1)
let longTermEnergy = 0;  // very slow average — kick detection baseline
let kick = 0;            // current kick impulse (0..1)
let activation = 0;      // 0 (idle) → 1 (active), eased
let lastKickTime = 0;    // ms — cooldown gate
let liveStartTime = 0;   // ms — when live mode started

function now() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function tick() {
  const t = now();
  let instant = 0;

  if (mode === "live" && analyser && dataArray) {
    analyser.getByteFrequencyData(dataArray as unknown as Uint8Array<ArrayBuffer>);
    // bass focus: first ~6 bins
    let sum = 0;
    const n = Math.min(6, dataArray.length);
    for (let i = 0; i < n; i++) sum += dataArray[i];
    instant = Math.min(1, (sum / (n * 255)) * 1.5);
  }

  // Smoothed envelope — slow attack, slower release ⇒ cinematic breathing
  // Faster on rise, gentler on fall.
  const attack = 0.12;
  const release = 0.04;
  if (instant > energy) energy += (instant - energy) * attack;
  else energy += (instant - energy) * release;

  // Long-term average for kick threshold (very slow)
  longTermEnergy += (instant - longTermEnergy) * 0.01;

  // Selective kick detection: instant must significantly exceed baseline AND
  // be loud enough AND respect a cooldown. This filters every-beat reactions
  // down to impactful moments.
  const minLevel = 0.45;
  const ratioGate = 1.55;
  const cooldownMs = 260;
  if (
    mode === "live" &&
    instant >= minLevel &&
    instant > longTermEnergy * ratioGate &&
    t - lastKickTime > cooldownMs
  ) {
    kick = Math.min(1, kick + 0.85);
    lastKickTime = t;
  }
  // Fast decay (~0.25s to near zero)
  kick *= 0.88;
  if (kick < 0.001) kick = 0;

  // Activation ramp
  const targetActivation = mode === "live" ? 1 : 0;
  const activationStep = mode === "live" ? 0.018 : 0.06; // wake slowly, sleep faster
  activation += (targetActivation - activation) * activationStep;
  if (mode === "idle" && activation < 0.001) activation = 0;

  // Gentle warm-up window: dampen energy/kick during the first ~800ms after play
  let warmup = 1;
  if (mode === "live" && liveStartTime > 0) {
    const dt = t - liveStartTime;
    if (dt < 1200) warmup = Math.max(0, Math.min(1, dt / 1200));
  }

  const pulseOut = mode === "live" ? energy * activation * warmup : 0;
  const kickOut = mode === "live" ? kick * activation * warmup : 0;

  const root = document.documentElement;
  root.style.setProperty("--pulse", pulseOut.toFixed(3));
  root.style.setProperty("--pulse-kick", kickOut.toFixed(3));
  root.style.setProperty("--pulse-activation", activation.toFixed(3));

  rafId = requestAnimationFrame(tick);
}

export function startPulse() {
  if (started || typeof window === "undefined") return;
  started = true;
  rafId = requestAnimationFrame(tick);
}

export function stopPulse() {
  cancelAnimationFrame(rafId);
  started = false;
  const root = document.documentElement;
  root.style.setProperty("--pulse", "0");
  root.style.setProperty("--pulse-kick", "0");
  root.style.setProperty("--pulse-activation", "0");
}

export function attachLiveAudio(audio: HTMLAudioElement) {
  try {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    audioCtx = audioCtx ?? new Ctx();

    if (!analyser) {
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.7;
      analyser.connect(audioCtx.destination);
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    if (audioCtx.state === "suspended") {
      void audioCtx.resume().catch(() => undefined);
    }

    let src = sourceNodes.get(audio);
    if (!src) {
      src = audioCtx.createMediaElementSource(audio);
      sourceNodes.set(audio, src);
    }

    if (currentSource && currentSource !== src) {
      try {
        currentSource.disconnect();
      } catch {
        // already disconnected
      }
    }

    try {
      src.disconnect();
    } catch {
      // not connected yet
    }

    src.connect(analyser);
    currentSource = src;
    return { ctx: audioCtx, analyser, dataArray };
  } catch {
    return null;
  }
}

export function setPulseLive() {
  if (mode !== "live") {
    liveStartTime = now();
    // Reset envelopes so the activation feels intentional, not stale.
    energy = 0;
    longTermEnergy = 0;
    kick = 0;
  }
  mode = "live";
}

export function setSimMode() {
  setPulseIdle();
}

export function setPulseIdle() {
  mode = "idle";
  liveStartTime = 0;
  // Don't slam to 0 — let activation ease down via tick() so the section
  // calms gracefully instead of snapping.
}
