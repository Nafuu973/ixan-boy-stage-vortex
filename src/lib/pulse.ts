// Global pulse driver — calm by default, switches to balanced FFT analysis while audio plays.
// Drives multiple CSS variables on document root each rAF:
//   --pulse           : smoothed total energy envelope (0..1) — drives general motion
//   --pulse-kick      : short impulse from low-band transients (0..1, fast decay)
//   --pulse-activation: 0→1 ramp on play start, back to 0 on idle
//   --pulse-low / --pulse-mid / --pulse-high : optional band envelopes (0..1)

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
let totalEnv = 0;
let lowEnv = 0;
let midEnv = 0;
let highEnv = 0;
let lowBaseline = 0;   // slow long-term average of low band — adaptive kick threshold
let kick = 0;
let activation = 0;
let lastKickTime = 0;
let liveStartTime = 0;

function now() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function bandAverage(data: Uint8Array, from: number, to: number) {
  const lo = Math.max(0, from);
  const hi = Math.min(data.length, to);
  if (hi <= lo) return 0;
  let sum = 0;
  for (let i = lo; i < hi; i++) sum += data[i];
  return sum / ((hi - lo) * 255);
}

function tick() {
  const t = now();
  let instantTotal = 0;
  let instantLow = 0;
  let instantMid = 0;
  let instantHigh = 0;

  if (mode === "live" && analyser && dataArray) {
    analyser.getByteFrequencyData(dataArray as unknown as Uint8Array<ArrayBuffer>);
    // Balanced band analysis — no longer bass-dominated.
    instantLow = Math.min(1, bandAverage(dataArray, 2, 10) * 1.35);
    instantMid = Math.min(1, bandAverage(dataArray, 12, 48) * 1.25);
    instantHigh = Math.min(1, bandAverage(dataArray, 50, 96) * 1.2);
    // Weighted total — mids carry musical motion, lows add weight, highs add sparkle.
    instantTotal = Math.min(
      1,
      instantLow * 0.35 + instantMid * 0.45 + instantHigh * 0.2,
    );
  }

  // Smoothed envelopes — fast attack, slower release.
  const attack = 0.22;
  const release = 0.07;
  const smooth = (env: number, target: number) =>
    env + (target - env) * (target > env ? attack : release);

  totalEnv = smooth(totalEnv, instantTotal);
  lowEnv = smooth(lowEnv, instantLow);
  midEnv = smooth(midEnv, instantMid);
  highEnv = smooth(highEnv, instantHigh);

  // Adaptive baseline for kick detection (slow follow on low band only).
  lowBaseline += (instantLow - lowBaseline) * 0.012;

  // Controlled kick detection — low band only, adaptive threshold, 320ms cooldown.
  const minLevel = 0.42;
  const ratioGate = 1.5;
  const cooldownMs = 320;
  if (
    mode === "live" &&
    instantLow >= minLevel &&
    instantLow > lowBaseline * ratioGate &&
    t - lastKickTime > cooldownMs
  ) {
    kick = Math.min(1, kick + 0.8);
    lastKickTime = t;
  }
  // Fast release (~0.2s)
  kick *= 0.84;
  if (kick < 0.001) kick = 0;

  // Activation ramp
  const targetActivation = mode === "live" ? 1 : 0;
  const activationStep = mode === "live" ? 0.02 : 0.06;
  activation += (targetActivation - activation) * activationStep;
  if (mode === "idle" && activation < 0.001) activation = 0;

  // Warm-up window: dampen during the first ~1200ms after play.
  let warmup = 1;
  if (mode === "live" && liveStartTime > 0) {
    const dt = t - liveStartTime;
    if (dt < 1200) warmup = Math.max(0, Math.min(1, dt / 1200));
  }

  const gate = mode === "live" ? activation * warmup : 0;
  const pulseOut = totalEnv * gate;
  const kickOut = kick * gate;

  const root = document.documentElement;
  root.style.setProperty("--pulse", pulseOut.toFixed(3));
  root.style.setProperty("--pulse-kick", kickOut.toFixed(3));
  root.style.setProperty("--pulse-activation", activation.toFixed(3));
  root.style.setProperty("--pulse-low", (lowEnv * gate).toFixed(3));
  root.style.setProperty("--pulse-mid", (midEnv * gate).toFixed(3));
  root.style.setProperty("--pulse-high", (highEnv * gate).toFixed(3));

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
  root.style.setProperty("--pulse-low", "0");
  root.style.setProperty("--pulse-mid", "0");
  root.style.setProperty("--pulse-high", "0");
}

export function attachLiveAudio(audio: HTMLAudioElement) {
  try {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    audioCtx = audioCtx ?? new Ctx();

    if (!analyser) {
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.72;
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
    totalEnv = 0;
    lowEnv = 0;
    midEnv = 0;
    highEnv = 0;
    lowBaseline = 0;
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
}
