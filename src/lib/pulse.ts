// Global pulse driver — simulated BPM 150 by default, switches to live FFT when audio plays.
// Updates CSS variable --pulse (0..1) on document root each rAF.

type Mode = "sim" | "live";

let mode: Mode = "sim";
let analyser: AnalyserNode | null = null;
let dataArray: Uint8Array | null = null;
let rafId = 0;
let started = false;

const BPM = 150;
const BEAT_MS = (60 / BPM) * 1000;

function tick() {
  let v = 0;
  if (mode === "live" && analyser && dataArray) {
    analyser.getByteFrequencyData(dataArray as unknown as Uint8Array<ArrayBuffer>);
    // bass focus: first ~8 bins
    let sum = 0;
    const n = Math.min(8, dataArray.length);
    for (let i = 0; i < n; i++) sum += dataArray[i];
    v = Math.min(1, sum / (n * 255) * 1.6);
  } else {
    // simulated kick envelope
    const t = performance.now() % BEAT_MS;
    const phase = t / BEAT_MS;
    // sharp attack, exp decay
    v = Math.pow(1 - phase, 4) * 0.9 + 0.05;
  }
  document.documentElement.style.setProperty("--pulse", v.toFixed(3));
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
}

export function attachLiveAudio(audio: HTMLAudioElement) {
  try {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new Ctx();
    const src = ctx.createMediaElementSource(audio);
    const a = ctx.createAnalyser();
    a.fftSize = 128;
    src.connect(a);
    a.connect(ctx.destination);
    analyser = a;
    dataArray = new Uint8Array(a.frequencyBinCount);
    mode = "live";
    return { ctx, analyser: a, dataArray };
  } catch {
    return null;
  }
}

export function setSimMode() {
  mode = "sim";
}
