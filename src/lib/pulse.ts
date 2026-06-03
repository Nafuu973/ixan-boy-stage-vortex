// Global pulse driver — calm by default, switches to beat/onset analysis while audio plays.
// Drives multiple CSS variables on document root each rAF:
//   --pulse           : smoothed total energy envelope (0..1) — drives general motion
//   --pulse-kick      : short impulse from detected bass/kick onsets (0..1, fast decay)
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
let coverBeat = 0;
let activation = 0;
let lastKickTime = 0;
let liveStartTime = 0;
let bassFast = 0;
let bassSlow = 0;
let fluxAvg = 0;
let fluxDev = 0;

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
    // Balanced band analysis for global motion.
    instantLow = Math.min(1, bandAverage(dataArray, 2, 12) * 1.2);
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

  // Beat detection for the cover: follow real bass onsets, not average loudness.
  // The first few frames seed the baselines so playback start never creates a fake hit.
  const lowerMid = mode === "live" && dataArray ? bandAverage(dataArray, 10, 24) : 0;
  const bassEnergy = Math.min(1, instantLow * 0.82 + lowerMid * 0.38);
  const sinceLiveStart = mode === "live" && liveStartTime > 0 ? t - liveStartTime : 0;
  if (mode !== "live" || sinceLiveStart < 420) {
    bassFast = bassEnergy;
    bassSlow = bassEnergy;
    lowBaseline = instantLow;
    fluxAvg = 0;
    fluxDev = 0;
  } else {
    bassFast += (bassEnergy - bassFast) * 0.38;
    bassSlow += (bassEnergy - bassSlow) * 0.045;
    lowBaseline += (instantLow - lowBaseline) * 0.03;

    const flux = Math.max(0, bassFast - bassSlow);
    fluxAvg += (flux - fluxAvg) * 0.06;
    fluxDev += (Math.abs(flux - fluxAvg) - fluxDev) * 0.06;

    const threshold = Math.max(0.002, fluxAvg + fluxDev * 0.22);
    const cooldownMs = 135;
    const hasBody = bassEnergy > 0.025 && bassEnergy > lowBaseline * 0.38;
    if (hasBody && flux > threshold && t - lastKickTime > cooldownMs) {
      const strength = Math.min(0.5, 0.18 + flux * 0.95 + bassEnergy * 0.22);
      kick = Math.max(kick, strength);
      lastKickTime = t;
    }

    const bodyMotion = Math.min(0.42, bassEnergy * 0.34 + flux * 0.85);
    coverBeat += (bodyMotion - coverBeat) * (bodyMotion > coverBeat ? 0.34 : 0.16);
  }
  // Smoother release for a softer beat motion.
  kick *= 0.93;
  if (mode !== "live") coverBeat *= 0.86;
  if (kick < 0.001) kick = 0;

  // Activation ramp
  const targetActivation = mode === "live" ? 1 : 0;
  const activationStep = mode === "live" ? 0.1 : 0.08;
  activation += (targetActivation - activation) * activationStep;
  if (mode === "idle" && activation < 0.001) activation = 0;

  // Warm-up window: dampen during the first ~700ms after play.
  let warmup = 1;
  if (mode === "live" && liveStartTime > 0) {
    const dt = t - liveStartTime;
    if (dt < 700) warmup = Math.max(0, Math.min(1, dt / 700));
  }

  const gate = mode === "live" ? activation * warmup : 0;
  const pulseOut = totalEnv * gate;
  const kickOut = Math.max(kick, coverBeat) * gate;

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
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.55;
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

export function getAnalyser(): AnalyserNode | null {
  return analyser;
}
