// Global pulse driver — calm by default, switches to beat/onset analysis while audio plays.
// Drives the --pulse CSS variable on document root each rAF:
//   --pulse : smoothed total energy envelope (0..1) — drives .pulse-glow / .pulse-scale

type Mode = "idle" | "live";

let mode: Mode = "idle";
let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let dataArray: Uint8Array | null = null;
let currentSource: MediaElementAudioSourceNode | null = null;
const sourceNodes = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>();
let rafId = 0;
let started = false;

// Envelope
let totalEnv = 0;
let activation = 0;
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

  if (mode === "live" && analyser && dataArray) {
    analyser.getByteFrequencyData(dataArray as unknown as Uint8Array<ArrayBuffer>);
    // Balanced band analysis for global motion.
    const instantLow = Math.min(1, bandAverage(dataArray, 2, 12) * 1.2);
    const instantMid = Math.min(1, bandAverage(dataArray, 12, 48) * 1.25);
    const instantHigh = Math.min(1, bandAverage(dataArray, 50, 96) * 1.2);
    // Weighted total — mids carry musical motion, lows add weight, highs add sparkle.
    instantTotal = Math.min(1, instantLow * 0.35 + instantMid * 0.45 + instantHigh * 0.2);
  }

  // Smoothed envelope — fast attack, slower release.
  const attack = 0.22;
  const release = 0.07;
  totalEnv += (instantTotal - totalEnv) * (instantTotal > totalEnv ? attack : release);

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

  document.documentElement.style.setProperty("--pulse", pulseOut.toFixed(3));

  rafId = requestAnimationFrame(tick);
}

export function startPulse() {
  if (started || typeof window === "undefined") return;
  started = true;
  rafId = requestAnimationFrame(tick);
}

export function isPulseRunning() {
  return started;
}

export function attachLiveAudio(audio: HTMLAudioElement) {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
  }
  mode = "live";
}

export function setPulseIdle() {
  mode = "idle";
  liveStartTime = 0;
}

export function getAnalyser(): AnalyserNode | null {
  return analyser;
}
