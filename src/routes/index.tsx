import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { Instagram, Music2, Youtube } from "lucide-react";
import { LangCtx, dict, useT, SOCIALS, type Lang } from "@/lib/i18n";
import { attachLiveAudio, setPulseIdle, setPulseLive, startPulse, isPulseRunning, getAnalyser } from "@/lib/pulse";
import { startTeaser, duckTeaser, unduckTeaser, getTeaserAnalyser } from "@/lib/teaser";

import { RevealText } from "@/components/epk/RevealText";
import heroImg from "@/assets/portrait-hero.jpg";
import tunnelImg from "@/assets/portrait-tunnel.jpg";
import logoImg from "@/assets/logo.png";
import coverFire from "@/assets/cover-take-me-body.png";
import coverRun from "@/assets/cover-sex-bomb.png";
import waveformBg from "@/assets/waveform-round.mp4.asset.json";
import liveBooth from "@/assets/live-booth.jpg";
import labelScantraxx from "@/assets/label-scantraxx-round.png";
import labelHFR from "@/assets/label-hardstyle-france-round.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [lang, setLang] = useState<Lang>("fr");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const tm = setTimeout(() => setReady(true), 1500);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      clearTimeout(tm);
    };
  }, []);

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <main className="relative bg-void text-bone">
        <Preloader done={ready} />
        <EnterOverlay visible={ready} />
        <TopBar lang={lang} setLang={setLang} />
        <Hero />
        <PulseBar />
        <Presentation />
        <Silence />
        <ExperienceLive />
        <WhyBook />
        <SignatureTracks />
        <MusicalDNA />
        <Proof />
        <BookingReady />
        <ContactFinal />
        <Footer />
      </main>
    </LangCtx.Provider>
  );
}

function TopLabelTypewriter() {
  const prefix = "Reclaim The Fire — ";
  const suffix = "OUT SEPT 26";
  const full = prefix + suffix;
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(full.slice(0, i));
        if (i >= full.length) { clearInterval(id); setDone(true); }
      }, 38);
      return () => clearInterval(id);
    }, 700);
    return () => clearTimeout(delay);
  }, []);

  // Periodic glitch on the whole label
  useEffect(() => {
    if (!done) return;
    const fire = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
      setTimeout(() => { setGlitch(true); setTimeout(() => setGlitch(false), 80); }, 200);
    };
    const id = setInterval(fire, 3500 + Math.random() * 2000);
    return () => clearInterval(id);
  }, [done]);

  const prefixDisplayed = displayed.slice(0, Math.min(displayed.length, prefix.length));
  const suffixDisplayed = displayed.length > prefix.length ? displayed.slice(prefix.length) : "";

  return (
    <div style={{ position: "absolute", top: "2rem", left: 0, right: 0, textAlign: "center", paddingLeft: "0.45em" }}
      className="font-mono text-xs uppercase tracking-[0.45em] md:text-sm"
    >
      <motion.span
        animate={done ? {
          opacity: glitch ? [1, 0.2, 1] : 1,
          x: glitch ? [0, -2, 2, 0] : 0,
        } : {}}
        style={{ color: "var(--violet)", display: "inline" }}
      >
        {prefixDisplayed}
      </motion.span>

      {suffixDisplayed && (
        <motion.span
          animate={{
            textShadow: glitch
              ? ["0 0 30px rgba(255,80,0,1)", "0 0 8px rgba(255,80,0,0.3)", "0 0 30px rgba(255,80,0,1)"]
              : ["0 0 10px rgba(255,100,20,0.5)", "0 0 28px rgba(255,100,20,0.9)", "0 0 10px rgba(255,100,20,0.5)"],
            opacity: glitch ? [1, 0.3, 1] : 1,
          }}
          transition={{ duration: glitch ? 0.12 : 1.8, repeat: glitch ? 0 : Infinity, ease: "easeInOut" }}
          style={{ color: "#ff6014", display: "inline" }}
        >
          {suffixDisplayed}
        </motion.span>
      )}

      {!done && <span style={{ color: "var(--violet)" }}>_</span>}
      {done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: 4, ease: [1, 0, 1, 0] }}
          style={{ color: "var(--violet)" }}
        >
          _
        </motion.span>
      )}
    </div>
  );
}

function EnterOverlay({ visible }: { visible: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  const open = visible && !dismissed;

  const words = ["IXAN", "BOY"];
  const subtitleWords = ["EPK", "·", "2026"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[180] grid place-items-center overflow-hidden bg-void"
        >
          {/* Animated radial glow */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              background: [
                "radial-gradient(ellipse 60% 50% at 50% 60%, oklch(0.35 0.26 295 / 0.18) 0%, transparent 70%)",
                "radial-gradient(ellipse 70% 60% at 50% 55%, oklch(0.45 0.28 295 / 0.28) 0%, transparent 70%)",
                "radial-gradient(ellipse 60% 50% at 50% 60%, oklch(0.35 0.26 295 / 0.18) 0%, transparent 70%)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Scan lines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, var(--bone) 2px, var(--bone) 3px)",
              backgroundSize: "100% 4px",
            }}
          />

          {/* Corner brackets */}
          {[
            "top-6 left-6 border-t border-l",
            "top-6 right-6 border-t border-r",
            "bottom-6 left-6 border-b border-l",
            "bottom-6 right-6 border-b border-r",
          ].map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.5 }}
              className={`absolute h-8 w-8 border-bone/20 md:h-12 md:w-12 ${cls}`}
            />
          ))}

          {/* Top label — typewriter effect */}
          <TopLabelTypewriter />

          {/* Main content — single column, truly centered */}
          <div style={{ width: "100%", textAlign: "center" }}>

            {/* Title */}
            <motion.h1
              style={{ color: "var(--bone)", whiteSpace: "nowrap", fontSize: "clamp(3.5rem, 12vw, 9rem)", lineHeight: 1, letterSpacing: "-0.02em" }}
              className="font-display"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              IXAN{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ color: "var(--bone)", textShadow: "0 0 18px rgba(168, 85, 247, 0.35)" }}
              >
                BOY
              </motion.span>
            </motion.h1>

            {/* EPK · 2026 — padding-left compense le tracking */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="mt-2 font-mono text-[10px] uppercase tracking-[0.5em] text-bone/40 md:text-[11px]"
              style={{ paddingLeft: "0.5em" }}
            >
              EPK <span className="text-violet">·</span> 2026
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: "1px", width: "12rem", margin: "1.5rem auto 0", background: "linear-gradient(to right, transparent, oklch(0.55 0.28 295 / 0.6), transparent)" }}
            />

            {/* Sound label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="mt-6 font-mono text-[9px] uppercase tracking-[0.38em] text-bone/40"
              style={{ paddingLeft: "0.38em" }}
            >
              Expérience musicale · Montez le son
            </motion.p>

            {/* Play button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginTop: "1.5rem" }}
            >
              <motion.button
                type="button"
                onClick={() => { startTeaser(); setDismissed(true); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Enter"
                style={{
                  display: "block",
                  margin: "0 auto",
                  position: "relative",
                  width: "5rem",
                  height: "5rem",
                  borderRadius: "9999px",
                  border: "1px solid oklch(0.55 0.28 295 / 0.5)",
                  background: "oklch(0.55 0.28 295 / 0.1)",
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <motion.span
                  style={{ position: "absolute", inset: 0, borderRadius: "9999px", border: "1px solid oklch(0.55 0.28 295 / 0.3)" }}
                  animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span
                  style={{ position: "absolute", inset: 0, borderRadius: "9999px", border: "1px solid oklch(0.55 0.28 295 / 0.2)" }}
                  animate={{ scale: [1, 2, 2], opacity: [0.4, 0, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                />
                <motion.span
                  style={{ position: "absolute", inset: 0, zIndex: -1, borderRadius: "9999px" }}
                  animate={{ boxShadow: ["0 0 20px oklch(0.55 0.28 295 / 0.3)", "0 0 50px oklch(0.55 0.28 295 / 0.6)", "0 0 20px oklch(0.55 0.28 295 / 0.3)"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <svg viewBox="0 0 14 14" style={{ position: "absolute", top: "50%", left: "50%", width: "1.5rem", height: "1.5rem", transform: "translate(-46%, -50%)", fill: "var(--bone)", filter: "drop-shadow(0 0 8px rgba(200,160,255,0.8))" }}>
                  <path d="M3 1.5 L12 7 L3 12.5 Z" />
                </svg>
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="mt-4 font-mono text-[8px] uppercase text-bone/30"
                style={{ letterSpacing: "0.4em", paddingLeft: "0.4em" }}
              >
                Appuyer pour entrer
              </motion.p>
            </motion.div>
          </div>

          {/* Bottom ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="absolute bottom-8 left-0 right-0 overflow-hidden"
          >
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="flex whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.35em] text-bone/20"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="mx-6">
                  Ixan Boy · Hardstyle · Reclaim The Fire · Booking 2026 · Expérience Live ·&nbsp;
                </span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TopBar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
      <div className="flex items-center gap-4">
        <img
          src={logoImg}
          alt="IXAN BOY"
          className="h-10 w-auto md:h-12 drop-shadow-[0_0_18px_rgba(170,130,255,0.35)]"
        />
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.32em] text-bone/75 sm:inline">
          EPK · 2026
        </span>
      </div>
      <div className="flex items-center font-mono text-[10px] uppercase tracking-[0.25em]">
        {(["fr", "en"] as const).map((l, i) => (
          <span key={l} className="flex items-center">
            {i > 0 && <span className="px-1 text-bone/25">/</span>}
            <button
              onClick={() => setLang(l)}
              className={`px-1.5 py-1 transition-colors ${
                lang === l ? "text-bone" : "text-bone/35 hover:text-bone/70"
              }`}
            >
              {l.toUpperCase()}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function Preloader({ done }: { done: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (done) {
      setN(100);
      return;
    }
    const id = setInterval(
      () => setN((v) => Math.min(99, v + Math.ceil(Math.random() * 7))),
      60,
    );
    return () => clearInterval(id);
  }, [done]);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-void"
        >
          <img
            src={logoImg}
            alt="IXAN BOY"
            className="h-24 w-auto pulse-scale drop-shadow-[0_0_30px_rgba(167,100,255,0.4)] md:h-32"
          />
          <div className="flex w-full items-end justify-between px-6 md:px-12">
            <span className="font-display text-3xl md:text-5xl">IXAN BOY</span>
            <span className="font-mono text-lg text-violet md:text-2xl">
              {String(n).padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Signature scan — biometric HARDSTYLE impact sweep, replays as a kick */
function SignatureScan() {
  const [key, setKey] = useState(0);
  useEffect(() => {
    // first replay shortly after mount, then irregular cadence for tension
    const timeouts: number[] = [];
    const schedule = (delay: number) => {
      const id = window.setTimeout(() => {
        setKey((k) => k + 1);
        schedule(2800 + Math.random() * 1400);
      }, delay);
      timeouts.push(id);
    };
    schedule(300);
    return () => timeouts.forEach((id) => clearTimeout(id));
  }, []);
  return (
    <div key={key} className="sig-scan z-[30]">
      <span className="sig-scan__bracket sig-scan__bracket--tl" />
      <span className="sig-scan__bracket sig-scan__bracket--tr" />
      <span className="sig-scan__bracket sig-scan__bracket--bl" />
      <span className="sig-scan__bracket sig-scan__bracket--br" />
      <span className="sig-scan__label">SIGNATURE · IXAN BOY</span>
      <div className="sig-scan__lines" />
      <div className="sig-scan__noise" />
      <div className="sig-scan__glitch" />
      <div className="sig-scan__flash" />
      <div className="sig-scan__bloom" />
      <div className="sig-scan__trail" />
      <div className="sig-scan__line" />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const t = useT();
  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={heroImg}
          alt="IXAN BOY"
          className="h-full w-full object-contain object-center md:object-contain md:object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-transparent to-void" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent,var(--void)_75%)]" />
        <div className="absolute inset-0 smoke opacity-30 mix-blend-screen drift" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col justify-end px-5 pb-8 md:px-12 md:pb-24"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
          {t.hero.sub}
        </div>
        <h1 className="hero-title font-display mt-3 text-[clamp(4rem,11vw,8rem)] leading-[0.85] tracking-tight">
          <span className="hero-title__word">IXAN</span>
          <br className="md:hidden" />
          <span className="hero-title__word hero-title__word--accent md:ml-6">BOY</span>
        </h1>

        <div className="mt-5 mb-6 sig-reveal flex justify-start -ml-1 md:-ml-4 md:mt-8 md:mb-8">
          <ChromeSignature text={t.hero.tag} />
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          <Cta href="#live" label={t.nav.live} primary />
          <Cta href="#contact" label={t.nav.booking} />
        </div>

        <p className="mt-4 max-w-md text-balance text-[11px] leading-relaxed text-bone/55 md:mt-10 md:text-xs">
          {t.hero.intro}
        </p>
      </motion.div>

      <SignatureScan />
    </section>
  );
}

/* Floating cinematic handwritten chrome signature */
function ChromeSignature({ text }: { text: string }) {
  const clean = text.replace(/\.$/, "");
  return (
    <figure
      className="hand-signature relative inline-block select-none"
      aria-label={text}
    >
      <span aria-hidden className="hand-signature__halo">{clean}</span>
      <span className="hand-signature__ink">{clean}</span>
    </figure>
  );
}

function Cta({
  href,
  label,
  primary,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-6 py-3 font-mono text-[11px] uppercase tracking-widest transition-all duration-300 will-change-transform hover:-translate-y-0.5 ${
        primary
          ? "border-violet/70 bg-gradient-to-b from-violet to-[oklch(0.45_0.26_295)] text-bone shadow-[0_8px_24px_-8px_var(--violet),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_12px_36px_-6px_var(--violet),inset_0_1px_0_rgba(255,255,255,0.35)]"
          : "border-bone/15 bg-bone/[0.04] text-bone/90 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-bone/40 hover:bg-bone/[0.08] hover:text-bone"
      }`}
    >
      {primary && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
      <span className="relative z-10">{label}</span>
      <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

function PulseBar() {
  const t = useT();
  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-obsidian/60 py-5">
      <div className="flex items-center gap-6 whitespace-nowrap px-5 md:px-12">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          <span className="h-1.5 w-1.5 rounded-full bg-violet pulse-glow" />
          {t.pulse.state}
        </span>
        <div className="flex h-6 flex-1 items-end gap-[2px]">
          {Array.from({ length: 80 }).map((_, i) => (
            <span
              key={i}
              className="flex-1 bg-bone/60"
              style={{
                height: `calc(${(15 + Math.abs(Math.sin(i * 0.4)) * 70).toFixed(2)}% * (0.6 + var(--pulse) * 0.9))`,
                opacity: Number((0.5 + Math.sin(i * 0.3) * 0.3).toFixed(3)),
              }}
            />
          ))}
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60 sm:inline">
          {t.pulse.feed}
        </span>
      </div>
    </section>
  );
}

function Presentation() {
  const t = useT();
  const [intro, body, signature, closing] = t.presentation.paragraphs;
  return (
    <section className="relative bg-void py-16 md:py-20">
      <div className="px-5 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet text-left"
        >
          01 · {t.presentation.kicker}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="font-display mt-5 uppercase text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.01em] text-balance text-right"
        >
          {t.presentation.title}
        </motion.h2>

        <div className="mt-8 md:mt-10 md:grid md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-6">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="font-serif italic text-balance text-xl leading-[1.55] text-bone md:text-2xl"
            >
              {intro}
            </motion.p>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="my-6 h-px w-16 origin-left bg-gradient-to-r from-violet/70 to-transparent md:my-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.05 }}
              className="text-balance text-base leading-[1.85] text-bone/80 md:text-lg md:leading-[1.9]"
            >
              {body}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.2, delay: 0.1 }}
              className="my-6 flex items-center gap-4 md:my-8"
            >
              <span className="h-px w-10 bg-violet/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-violet/80">
                Signature
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-violet/40 to-transparent" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9 }}
              className="font-display text-balance text-2xl leading-[1.05] text-bone md:text-3xl"
            >
              {signature}
            </motion.p>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="my-6 h-px w-24 origin-left bg-gradient-to-r from-violet/60 via-violet/30 to-transparent md:my-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="text-balance text-base leading-[1.85] text-bone/70 md:text-lg md:leading-[1.9]"
            >
              {closing}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceLive() {
  const t = useT();
  return (
    <section
      id="live"
      className="relative isolate overflow-hidden bg-void py-14 md:py-20"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 smoke drift" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,oklch(0.55_0.28_295/0.4),transparent_60%)]" />
      </div>

      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          02 · {t.live.kicker}
        </div>
        <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.2rem)] leading-[0.9]">
          {t.live.headline[0]}
          <br />
          <span className="text-violet">{t.live.headline[1]}</span>
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="relative aspect-video w-full max-h-[50vh] overflow-hidden rounded-sm border border-bone/10 bg-obsidian">
              <img
                src={liveBooth}
                alt="IXAN BOY live"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center contrast-110 saturate-[0.75]"
              />
              <div className="absolute inset-0 bg-void/55 mix-blend-multiply" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,oklch(0.55_0.28_295/0.35),transparent_60%)] mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/30" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/80">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember pulse-glow" />
                  REC · LIVE
                </span>
                <span className="text-bone/50">CAM_01 / 04</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 py-4">
                <span className="font-display text-2xl leading-none md:text-4xl">
                  IXAN BOY
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
                  RAW · LIVE
                </span>
              </div>
              {[
                "top-2 left-2",
                "top-2 right-2",
                "bottom-2 left-2",
                "bottom-2 right-2",
              ].map((p) => (
                <span
                  key={p}
                  className={`absolute ${p} h-3 w-3 border-violet`}
                  style={{
                    borderTopWidth: p.includes("top") ? 1 : 0,
                    borderBottomWidth: p.includes("bottom") ? 1 : 0,
                    borderLeftWidth: p.includes("left") ? 1 : 0,
                    borderRightWidth: p.includes("right") ? 1 : 0,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-end gap-6 md:col-span-4">
            {t.live.side.map((l, i) => (
              <p
                key={i}
                className="font-serif-i text-2xl leading-tight text-bone/90 md:text-3xl break-words hyphens-auto"
              >
                {l}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyBook() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-void py-14 md:py-20">
      {/* ambient background — texture scan, micro grid, soft volumetric light */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.10]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "140px 140px, 140px 140px",
            maskImage: "radial-gradient(ellipse at 20% 40%, black 25%, transparent 70%)",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full opacity-[0.18] blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(140,90,230,0.28), transparent 70%)" }}
      />
      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-violet/20 to-transparent md:block" />

      <div className="relative px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          03 · {t.why.kicker}
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="font-display mt-5 whitespace-nowrap uppercase text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.01em] text-balance"
        >
          {t.why.title}
        </motion.h2>
        <div className="mt-5 h-px w-16 bg-violet/40" />

        <div className="mt-16 grid gap-5 md:mt-20 md:grid-cols-12">
          {t.why.cards.map((c, i) => {
            const isArtists = "artists" in c && Array.isArray((c as any).artists);
            const isList = Array.isArray((c as any).p);
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative overflow-hidden rounded-sm border border-bone/10 bg-obsidian/50 p-5 backdrop-blur transition-all duration-500 hover:border-violet/30 hover:bg-obsidian/70 md:p-6 md:col-span-4 ${
                  i === 0 ? "md:mt-0" : i === 1 ? "md:mt-16" : "md:mt-6"
                }`}
              >
                {/* bordure gauche accent */}
                <span className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-violet to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* bloom violet coin haut-gauche */}
                <span className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-violet/10 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                {/* sweep lumineux gauche → droite */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {/* grand numéro fantôme — scale + rotation au hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-6 -right-3 font-display text-[8rem] leading-none text-bone/[0.04] select-none transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 group-hover:text-violet/[0.10]"
                >
                  0{i + 1}
                </span>

                {/* dégradé de fond au hover */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* corner brackets */}
                <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-violet/30 transition-colors duration-300 group-hover:border-violet/70" />
                <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-violet/30 transition-colors duration-300 group-hover:border-violet/70" />
                <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-violet/30 transition-colors duration-300 group-hover:border-violet/70" />
                <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-violet/30 transition-colors duration-300 group-hover:border-violet/70" />

                {/* card index — HUD metadata */}
                <div className="flex items-center gap-2">
                  <span className="h-px w-3 bg-bone/20" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/30">
                    {c.k}
                  </span>
                </div>

                {isArtists ? (
                  <>
                    <h3 className="font-serif-i mt-5 text-base leading-[1.4] text-bone/65 md:text-lg">
                      {(c as any).h}
                    </h3>
                    <div className="mt-3 h-px w-10 bg-violet/20" />
                    <ul className="mt-7 space-y-2.5 md:space-y-3">
                      {(c as any).artists.map((a: string, k: number) => (
                        <motion.li
                          key={a}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ delay: 0.25 + k * 0.12, duration: 0.55 }}
                          className="font-display text-base tracking-wide text-bone/85 md:text-lg"
                        >
                          {a}
                        </motion.li>
                      ))}
                    </ul>
                    <p className="mt-10 text-[13px] leading-relaxed text-bone/55">
                      {c.p as string}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-serif-i mt-5 text-base leading-[1.4] text-bone/65 md:text-lg">
                      {(c as any).h}
                    </h3>
                    <div className="mt-4 h-px w-10 bg-violet/20" />
                    {isList ? (
                      <ul className="mt-7 space-y-2 text-[13px] leading-relaxed text-bone/55">
                        {((c as any).p as readonly string[]).map((line, k) => (
                          <li key={k}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-7 text-[13px] leading-relaxed text-bone/55">
                        {c.p as string}
                      </p>
                    )}
                  </>
                )}

                <span className="absolute -bottom-px left-0 h-px w-0 bg-violet/70 transition-all duration-700 group-hover:w-full" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Silence() {
  const t = useT();
  return (
    <section className="relative flex min-h-[40vh] items-center justify-center bg-void px-5 py-14">
      <RevealText
        text={t.silence}
        className="font-serif-i text-balance text-center text-3xl text-bone/90 md:text-6xl"
      />
    </section>
  );
}

/* Waveform LED — barres verticales segmentées montant depuis une ligne centrale
   glow + reflet miroir en dessous, façon equalizer cinématique. */
const WAVEFORM_TOP_H = 20;          // hauteur de la zone "barres"
const WAVEFORM_REFLECT_H = 5;       // hauteur du reflet miroir (réduit)
const SEG_H = 4;                    // hauteur d'un segment LED en px
const SEG_GAP = 2;                  // gap entre segments en px
const SEG_STRIDE = SEG_H + SEG_GAP;

function WaveformBars({ isActive, numBars = 56 }: { isActive: boolean; numBars?: number }) {
  const topRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reflectRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const smoothRef = useRef<number[]>(new Array(numBars).fill(0));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    const applyIdle = () => {
      smoothRef.current = smoothRef.current.map(() => 0);
      for (let idx = 0; idx < numBars; idx++) {
        const v = 0.06 + Math.abs(Math.sin(idx * 0.45)) * 0.04;
        const top = topRefs.current[idx];
        const ref = reflectRefs.current[idx];
        if (top) top.style.transform = `scaleY(${v.toFixed(3)})`;
        if (ref) ref.style.transform = `scaleY(${v.toFixed(3)})`;
      }
    };

    if (!isActive) {
      applyIdle();
      return;
    }

    const tick = () => {
      const an = getAnalyser();
      if (!an) { rafRef.current = requestAnimationFrame(tick); return; }
      const data = new Uint8Array(an.frequencyBinCount);
      an.getByteFrequencyData(data);

      const smooth = smoothRef.current;
      const half = numBars / 2;
      for (let idx = 0; idx < numBars; idx++) {
        const top = topRefs.current[idx];
        const ref = reflectRefs.current[idx];
        if (!top) continue;
        // Symétrie verticale : graves au centre, aigus vers l'extérieur.
        // Mapping log + MAX dans la bande pour préserver les pics (évite le bloc uniforme).
        const dist = Math.abs(idx - (numBars - 1) / 2) / half; // 0 au centre → 1 aux bords
        const minT = 0.003;
        const maxT = 0.65; // coupe les très hautes fréquences (souvent vides)
        const step = 1 / half;
        const t0 = minT * Math.pow(maxT / minT, dist);
        const t1 = minT * Math.pow(maxT / minT, Math.min(1, dist + step));
        const lo = Math.floor(t0 * data.length);
        const hi = Math.max(lo + 1, Math.floor(t1 * data.length));
        let peak = 0;
        for (let b = lo; b < hi; b++) if (data[b] > peak) peak = data[b];
        let raw = peak / 255;
        // Compression douce + boost progressif vers les aigus.
        // Mise à l'échelle douce : on garde de la dynamique sans saturer.
        raw = Math.pow(raw, 1.25) * 0.7;
        raw *= 1 + Math.pow(dist, 1.2) * 0.5;
        raw = Math.min(0.92, raw);

        const prev = smooth[idx];
        const k = raw > prev ? 0.9 : 0.05;
        smooth[idx] = prev + (raw - prev) * k;
        const v = Math.max(0.05, smooth[idx]);
        const s = v.toFixed(3);
        top.style.transform = `scaleY(${s})`;
        if (ref) ref.style.transform = `scaleY(${s})`;

      }

      const midLow = Math.floor(half * 0.4);
      const midHigh = Math.floor(half * 0.7);
      const midPeak = smooth.slice(midLow, midHigh).reduce((m, v) => v > m ? v : m, 0);
      const bassPeak = Math.max(0, midPeak - 0.78) / 0.22;
      document.documentElement.style.setProperty("--pulse-cover", bassPeak.toFixed(3));

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isActive, numBars]);

  const activeBg =
    "linear-gradient(to top, rgba(88,28,135,0.6) 0%, #a855f7 55%, #d8b4fe 85%, #ffffff 100%)";
  const idleBg = "rgba(168,85,247,0.18)";

  const renderBar = (origin: "bottom" | "top", refsArr: React.MutableRefObject<(HTMLSpanElement | null)[]>) =>
    Array.from({ length: numBars }).map((_, idx) => {
      const idle = 0.06 + Math.abs(Math.sin(idx * 0.45)) * 0.04;
      const roundedTop = origin === "bottom" ? "2px 2px 0 0" : "0 0 2px 2px";
      return (
        <span
          key={`${origin}-${idx}`}
          ref={(el) => { refsArr.current[idx] = el; }}
          style={{
            flex: "1 1 0",
            minWidth: 0,
            height: "100%",
            transformOrigin: origin === "bottom" ? "center bottom" : "center top",
            transform: `scaleY(${idle.toFixed(3)})`,
            background: isActive ? activeBg : idleBg,
            borderRadius: roundedTop,
            boxShadow: isActive ? "0 0 6px rgba(168,85,247,0.45)" : "none",
            willChange: "transform",
            display: "block",
          }}
        />
      );
    });

  return (
    <div
      className="mx-auto relative"
      style={{
        width: "100%",
        maxWidth: "100%",
        contain: "layout paint",
      }}
    >
      {/* Barres principales (montent depuis la ligne centrale) */}
      <div
        className="flex items-end gap-[2px]"
        style={{ height: `${WAVEFORM_TOP_H}px` }}
      >
        {renderBar("bottom", topRefs)}
      </div>

      {/* Ligne horizontale lumineuse au centre */}
      <div
        aria-hidden
        style={{
          height: "1px",
          width: "100%",
          background: isActive
            ? "linear-gradient(to right, transparent 0%, #c084fc 50%, transparent 100%)"
            : "linear-gradient(to right, transparent 0%, rgba(168,85,247,0.3) 50%, transparent 100%)",
          boxShadow: isActive ? "0 0 10px #a855f7, 0 0 18px rgba(168,85,247,0.5)" : "none",
        }}
      />

      {/* Reflet miroir (réduit, flouté, atténué) */}
      <div
        className="flex items-start gap-[2px]"
        style={{
          height: `${WAVEFORM_REFLECT_H}px`,
          opacity: isActive ? 0.35 : 0.2,
          filter: "blur(0.5px)",
        }}
      >
        {renderBar("top", reflectRefs)}
      </div>
    </div>
  );
}



function WaveformCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas!.width = wrap!.offsetWidth * dpr;
      canvas!.height = wrap!.offsetHeight * dpr;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const FREQ_SIZE = 512;
    const freqBuf = new Uint8Array(FREQ_SIZE);

    // Enveloppes
    let energyEnv = 0;
    let bassEnv = 0;
    let kickVal = 0;
    let lastKick = 0;

    // Cubes particules pré-calculés
    const CUBES = 14;
    const cubes = Array.from({ length: CUBES }, (_, i) => ({
      rx: 0.08 + Math.random() * 0.84,
      ry: 0.62 + Math.random() * 0.32,
      size: 4 + Math.random() * 8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
    }));

    function getAn() { return getAnalyser() || getTeaserAnalyser(); }

    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      const W = canvas!.width;
      const H = canvas!.height;
      const cx = W / 2;
      const t = performance.now() / 1000;

      const an = getAn();
      if (an) {
        an.getByteFrequencyData(freqBuf as unknown as Uint8Array<ArrayBuffer>);
      } else {
        for (let i = 0; i < FREQ_SIZE; i++)
          freqBuf[i] = 14 + Math.sin(t * 0.5 + i * 0.06) * 12;
      }

      // Enveloppes
      let bassNow = 0, midNow = 0;
      for (let i = 0; i < 6; i++) bassNow += freqBuf[i] / 255;
      for (let i = 6; i < 80; i++) midNow += freqBuf[i] / 255;
      bassNow /= 6; midNow /= 74;
      const rawE = bassNow * 0.45 + midNow * 0.55;
      energyEnv += (rawE > energyEnv ? 0.15 : 0.03) * (rawE - energyEnv);
      bassEnv   += (bassNow > bassEnv ? 0.25 : 0.06) * (bassNow - bassEnv);

      // Kick detection
      if (bassNow > bassEnv * 1.35 && t - lastKick > 0.16) {
        kickVal = 1; lastKick = t;
      }
      kickVal *= 0.78;

      // ── TRAIL ─────────────────────────────────────────────────────────
      ctx.fillStyle = `rgba(0,0,0,${0.22 - energyEnv * 0.06})`;
      ctx.fillRect(0, 0, W, H);

      // ── 1. ANNEAUX CONCENTRIQUES (sol en perspective) ─────────────────
      const stageCY = H * 0.74;
      const NRINGS = 5;
      for (let r = NRINGS - 1; r >= 0; r--) {
        const f = (r + 1) / NRINGS;
        const rx = W * 0.50 * f * (1 + bassEnv * 0.08 + kickVal * 0.05);
        const ry = rx * 0.13;

        // Couleur : violet intérieur → rose/magenta extérieur
        const hue = 270 + (1 - f) * 60;
        const bright = 55 + energyEnv * 30 + kickVal * 20;
        const alpha = 0.55 + f * 0.3 + bassEnv * 0.2;

        ctx.beginPath();
        ctx.ellipse(cx, stageCY, rx, ry, 0, 0, Math.PI * 2);
        ctx.shadowBlur = 18 + f * 20 + bassEnv * 25 + kickVal * 30;
        ctx.shadowColor = `hsl(${hue},100%,70%)`;
        ctx.strokeStyle = `hsla(${hue},100%,${bright}%,${alpha})`;
        ctx.lineWidth = 1 + f * 2 + bassEnv * 2 + kickVal * 3;
        ctx.stroke();
      }

      // ── 2. BARRES EQ SYMÉTRIQUES ──────────────────────────────────────
      const N = 38;            // barres par côté
      const barW = W * 0.011;
      const baseline = H * 0.70;
      const maxBarH = H * 0.58;
      const spread = W * 0.46;

      for (let i = 0; i < N; i++) {
        const fi = i / N;               // 0 = centre, 1 = bord
        const fIdx = Math.floor(fi * 90);
        const v = freqBuf[fIdx] / 255;
        const barH = (v * 0.85 + energyEnv * 0.15) * maxBarH * (1 - fi * 0.35);

        // Position : convergence vers le centre
        const x = cx + (fi * spread + barW * (i + 1));
        const xL = cx - (fi * spread + barW * (i + 1));

        // Couleur : centre = violet/blanc, bords = rose/magenta
        const hue = 270 - fi * 80;
        const bright = 70 + v * 25 + energyEnv * 20;
        const alpha = 0.4 + v * 0.6;

        ctx.shadowBlur = 10 + v * 22 + kickVal * 15;
        ctx.shadowColor = `hsl(${hue},100%,75%)`;
        ctx.fillStyle = `hsla(${hue},100%,${bright}%,${alpha})`;

        // Barre droite
        ctx.fillRect(x, baseline - barH, barW, barH);
        // Barre gauche (miroir)
        ctx.fillRect(xL - barW, baseline - barH, barW, barH);

        // Ligne de base lumineuse
        if (i === 0) {
          ctx.fillStyle = `hsla(270,100%,80%,${0.3 + energyEnv * 0.5})`;
          ctx.fillRect(xL - barW, baseline - 1.5, x - xL + barW * 2, 2);
        }
      }

      // ── 3. CUBES PARTICULES FLOTTANTS ────────────────────────────────
      ctx.shadowBlur = 0;
      for (const c of cubes) {
        const px = c.rx * W;
        const py = c.ry * H + Math.sin(t * c.speed + c.phase) * (6 + bassEnv * 12);
        const s = c.size * (0.8 + bassEnv * 0.6 + kickVal * 0.4) * dpr;
        const hue = 250 + Math.sin(c.phase) * 50;
        const alpha = 0.5 + bassEnv * 0.4 + kickVal * 0.3;

        ctx.shadowBlur = 12 + bassEnv * 20;
        ctx.shadowColor = `hsl(${hue},100%,70%)`;
        ctx.fillStyle = `hsla(${hue},100%,70%,${alpha})`;
        ctx.fillRect(px - s / 2, py - s / 2, s, s);
      }

      // ── 4. GLOW CENTRAL AU SOL ────────────────────────────────────────
      ctx.shadowBlur = 0;
      const grd = ctx.createRadialGradient(cx, stageCY, 0, cx, stageCY, W * 0.3);
      grd.addColorStop(0, `hsla(270,100%,70%,${0.12 + energyEnv * 0.2 + kickVal * 0.25})`);
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    draw();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", mixBlendMode: "screen", opacity: 0.95 }} />
    </div>
  );
}

function SignatureTracks() {
  const t = useT();
  const tracks = [
    { ...t.tracks.list[0], cover: coverFire, src: "/audio/take-me-body-player.mp3?v=3" },
    { ...t.tracks.list[1], cover: coverRun, src: "/audio/sex-bomb-player.mp3" },
  ];
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([null, null]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const attachedAudioRefs = useRef(new WeakSet<HTMLAudioElement>());
  // Tracks whether a paused track was paused by the user clicking its OWN pause
  // button (resume-from-position) vs. paused due to a switch/end/error (restart).
  const selfPausedRef = useRef<boolean[]>([false, false]);

  const duckedRef = useRef(false);
  const ensureDucked = () => {
    if (!duckedRef.current) {
      duckTeaser();
      duckedRef.current = true;
    }
  };
  const releaseDuckIfIdle = () => {
    const anyAudioPlaying = audioRefs.current.some(
      (audio) => audio && !audio.paused && !audio.ended,
    );
    if (!anyAudioPlaying && duckedRef.current) {
      unduckTeaser();
      duckedRef.current = false;
    }
  };

  const setCalmIfNoAudioPlaying = () => {
    const anyAudioPlaying = audioRefs.current.some(
      (audio) => audio && !audio.paused && !audio.ended,
    );
    if (!anyAudioPlaying) setPulseIdle();
    releaseDuckIfIdle();
  };

  const toggle = (i: number) => {
    const audios = audioRefs.current;
    const target = audios[i];
    if (!target) return;
    // Pause every other track first; visual state is synced by real media events.
    audios.forEach((a, idx) => {
      if (a && idx !== i) {
        if (!a.paused) {
          a.pause();
          a.currentTime = 0;
        }
        // Any other track being touched is NOT a self-pause for that track.
        selfPausedRef.current[idx] = false;
      }
    });
    if (!target.paused) {
      // User is pausing this exact track → allow resume from current position.
      selfPausedRef.current[i] = true;
      target.pause();
      setCalmIfNoAudioPlaying();
      return;
    }

    if (!attachedAudioRefs.current.has(target)) {
      attachLiveAudio(target);
      attachedAudioRefs.current.add(target);
    } else {
      attachLiveAudio(target);
    }
    if (!isPulseRunning()) startPulse();

    // Start fresh unless this is a resume after the user's own pause.
    if (!selfPausedRef.current[i] || target.ended) {
      try {
        target.currentTime = 0;
      } catch {
        // ignore — some browsers throw if metadata isn't ready yet.
      }
    }
    selfPausedRef.current[i] = false;

    // Duck the background teaser before the track starts.
    ensureDucked();

    // Keep play() directly inside the user gesture; visuals activate on onPlaying.
    const p = target.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        setPulseIdle();
        releaseDuckIfIdle();
        setActiveIndex((cur) => (cur === i ? null : cur));
      });
    }
  };

  return (
    <section id="tracks" className="relative overflow-hidden bg-void py-10 md:py-12">
      {/* Waveform canvas réactif à l'audio — remplace la vidéo statique */}
      <WaveformCanvas />
      <div className="relative z-10 px-5 md:px-20">

        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          04 · {t.tracks.kicker}
        </div>
        <h2 className="font-display mt-4 max-w-[18ch] text-balance text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.01em] md:mt-5">
          {t.tracks.title}
        </h2>

        <div className="mt-6 md:mt-8 md:grid md:grid-cols-2 md:gap-4 space-y-8 md:space-y-0 md:items-start">
          {tracks.map((tr, i) => {
            const isActive = activeIndex === i;
            return (
              <motion.div
                key={tr.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className={`flex flex-col items-center gap-3 ${i === 1 ? "md:mt-20" : ""}`}
              >
                <div className="relative group/wrap">
                  {isActive && <div key={`aura-${i}`} aria-hidden className="track-activate-aura" />}
                  {/* halo néon violet — large bloom réactif */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-10 rounded-full bg-violet/40 blur-3xl transition-opacity duration-500"
                    style={{
                      opacity: isActive
                        ? `calc(0.45 + var(--pulse-cover, 0) * 1.1)`
                        : undefined,
                      transform: isActive
                        ? `scale(calc(1 + var(--pulse-cover, 0) * 0.25))`
                        : undefined,
                    }}
                  />
                  {/* halo serré — neon edge */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-3 rounded-sm bg-violet/30 blur-xl opacity-50 group-hover/wrap:opacity-90 transition-opacity duration-300"
                    style={
                      isActive
                        ? {
                            opacity: `calc(0.7 + var(--pulse-cover, 0) * 0.8)`,
                            transform: `scale(calc(1 + var(--pulse-cover, 0) * 0.08))`,
                          }
                        : undefined
                    }
                  />
                  {/* flash ember sur kick */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-4 rounded-full bg-ember/40 blur-2xl opacity-0"
                    style={
                      isActive
                        ? { opacity: `calc(var(--pulse-cover, 0) * 0.65)` }
                        : undefined
                    }
                  />
                  <div
                    className={`group/cover relative h-[26vh] aspect-square overflow-hidden rounded-sm border transition-[border-color] duration-700 ${
                      isActive ? "track-cover-shell-active border-violet/30" : "border-bone/10 hover:border-bone/25"
                    }`}
                  >
                    <div
                      className="absolute inset-0 track-cover-breathe"
                      style={
                        isActive
                          ? {
                              transform:
                                "scale(calc(1 + var(--pulse-cover, 0) * 0.10 * var(--fx-cover-kick, 1)))",
                              filter:
                                "brightness(calc(1 + var(--pulse-cover, 0) * 0.12)) contrast(calc(1 + var(--pulse-cover, 0) * 0.035)) saturate(calc(1 + var(--pulse-cover, 0) * 0.07))",
                              transition: "transform 80ms linear, filter 110ms linear",
                              willChange: "transform, filter",
                            }
                          : undefined
                      }
                    >
                      <img
                        src={tr.cover}
                        alt={tr.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-void/10 to-transparent" />
                    <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/80">
                      TRACK · 0{i + 1}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                    IXAN BOY — Track 0{i + 1}
                  </p>
                  <h3 className="font-mono text-lg uppercase tracking-[0.08em] text-bone md:text-xl">
                    {tr.title}
                  </h3>
                  {/* ── Player ── */}
                  <div
                    className="mt-4 flex flex-col items-stretch gap-3"
                    style={{ width: "26vh", maxWidth: "100%" }}
                  >
                    {/* Ligne 1 : status LIVE aligné à droite */}
                    <div className="flex items-center justify-end w-full">
                      <div
                        className="flex items-center gap-2 px-2.5 py-1 rounded-sm transition-colors duration-500"
                        style={{
                          background: isActive ? "rgba(88,28,135,0.25)" : "transparent",
                          border: `1px solid ${isActive ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.08)"}`,
                        }}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${isActive ? "animate-pulse" : ""}`}
                          style={{
                            background: isActive ? "#ef4444" : "rgba(255,255,255,0.2)",
                            boxShadow: isActive ? "0 0 8px #ef4444" : "none",
                          }}
                        />
                        <span
                          className="font-mono text-[9px] uppercase tracking-[0.25em] font-bold"
                          style={{ color: isActive ? "#c084fc" : "rgba(255,255,255,0.25)" }}
                        >
                          {isActive ? "Live" : "Stand by"}
                        </span>
                      </div>
                    </div>

                    {/* Ligne 2 : bouton à gauche + waveform à droite */}
                    <div className="flex items-center gap-5 w-full">
                      <div className="relative shrink-0">
                        {/* Halo néon */}
                        <span
                          aria-hidden
                          className={`absolute -inset-3 rounded-full blur-2xl transition-opacity duration-500 ${
                            isActive ? "opacity-100" : "opacity-60 group-hover:opacity-90"
                          }`}
                          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.75), transparent 70%)" }}
                        />
                        <button
                          onClick={() => toggle(i)}
                          aria-label={isActive ? `Pause ${tr.title}` : `Play ${tr.title}`}
                          className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent transition-transform duration-200 active:scale-90 hover:scale-105"
                          style={{
                            border: "2px solid #c084fc",
                            boxShadow:
                              "0 0 8px #a855f7, 0 0 16px rgba(168,85,247,0.7), inset 0 0 8px rgba(168,85,247,0.45)",
                          }}
                        >
                          {isActive ? (
                            <span className="flex items-end gap-[3px] h-[14px]">
                              <span className="w-[3px] rounded-sm" style={{ background: "#f0abfc", boxShadow: "0 0 6px #a855f7, 0 0 10px #a855f7", animation: "eqBar 0.6s ease-in-out infinite", height: "60%" }} />
                              <span className="w-[3px] rounded-sm" style={{ background: "#f0abfc", boxShadow: "0 0 6px #a855f7, 0 0 10px #a855f7", animation: "eqBar 0.8s ease-in-out 0.15s infinite", height: "100%" }} />
                              <span className="w-[3px] rounded-sm" style={{ background: "#f0abfc", boxShadow: "0 0 6px #a855f7, 0 0 10px #a855f7", animation: "eqBar 0.7s ease-in-out 0.3s infinite", height: "75%" }} />
                            </span>
                          ) : (
                            <svg viewBox="0 0 14 14" className="ml-[2px] h-[14px] w-[14px]" fill="#f0abfc" style={{ filter: "drop-shadow(0 0 4px #a855f7) drop-shadow(0 0 8px #a855f7)" }}>
                              <path d="M3 1.5 L12 7 L3 12.5 Z" />
                            </svg>
                          )}
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <WaveformBars isActive={isActive} numBars={56} />
                      </div>
                    </div>


                  </div>

                  <audio
                    ref={(el) => {
                      audioRefs.current[i] = el;
                    }}
                    src={tr.src || undefined}
                    preload="auto"
                    playsInline
                    onPlaying={() => {
                      setPulseLive();
                      setActiveIndex(i);
                    }}
                    onPause={() => {
                      setCalmIfNoAudioPlaying();
                      setActiveIndex((cur) => (cur === i ? null : cur));
                    }}
                    onEnded={(event) => {
                      event.currentTarget.currentTime = 0;
                      setCalmIfNoAudioPlaying();
                      setActiveIndex((cur) => (cur === i ? null : cur));
                    }}
                    onError={() => {
                      setCalmIfNoAudioPlaying();
                      setActiveIndex((cur) => (cur === i ? null : cur));
                    }}
                  />

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MusicalDNA() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-obsidian/40 py-14 md:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,oklch(0.62_0.26_15/0.2),transparent_55%)]" />
      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          05 · {t.dna.kicker}
        </div>

        <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.2rem)] leading-[0.9] text-balance uppercase">
          {t.dna.title}
        </h2>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7 space-y-8">
            <div className="space-y-2">
              {t.dna.intro.map((line, i) => (
                <p
                  key={i}
                  className="font-serif-i text-2xl leading-tight text-bone/90 md:text-4xl"
                >
                  {line}
                </p>
              ))}
            </div>
            <div className="border-t border-bone/10 pt-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
                {t.dna.bodyKicker}
              </span>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-bone/75 md:text-lg">
                {t.dna.body}
              </p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative md:col-span-5"
          >
            <div className="track-breathe relative aspect-[3/4] max-h-[50vh] overflow-hidden rounded-sm border border-bone/10">
              <img
                src={tunnelImg}
                alt="IXAN BOY"
                loading="lazy"
                className="h-full w-full object-cover contrast-110 grayscale-[20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,oklch(0.55_0.28_295/0.18))]" />
              <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/80">
                ID · 0X · IXAN
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Proof() {
  const t = useT();
  const labels = [
    {
      name: "Scantraxx Prospexx",
      logo: labelScantraxx,
      releases: ["So Dumb", "Through The Fire", "Better Not Run"],
    },
    {
      name: "Hardstyle France Records",
      logo: labelHFR,
      releases: ["Take Me Body", "Sex Bomb"],
    },
  ];
  const supports = ["Kronos", "Damien RK", "Fury", "Miss Pepper"];
  return (
    <section className="relative bg-void py-12 md:py-16">
      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          06 · {t.proof.kicker}
        </div>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
              {t.proof.labels}
            </span>
            <div className="mt-6 space-y-px overflow-hidden rounded-sm bg-bone/10">
              {labels.map((l) => (
                <div
                  key={l.name}
                  className="group relative grid grid-cols-5 gap-4 bg-gradient-to-br from-obsidian/80 to-obsidian/40 p-5 backdrop-blur transition-colors hover:from-violet/[0.08] hover:to-obsidian/40 md:p-6"
                >
                  <div className="col-span-2 flex items-center justify-center border-r border-bone/10 pr-4">
                    <img
                      src={l.logo}
                      alt={l.name}
                      loading="lazy"
                      className="max-h-20 w-auto max-w-full object-contain drop-shadow-[0_0_20px_rgba(167,100,255,0.18)] transition-transform duration-700 group-hover:scale-[1.04] md:max-h-24"
                    />
                  </div>
                  <div className="col-span-3 flex flex-col justify-center">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-bone/50">
                      {l.name}
                    </span>
                    <ul className="mt-2 space-y-1">
                      {l.releases.map((r) => (
                        <li
                          key={r}
                          className="flex items-center gap-2 font-display text-base leading-tight text-bone/90 md:text-xl"
                        >
                          <span className="h-px w-3 bg-violet/70" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
              {t.proof.supports}
            </span>
            <ul className="mt-6 space-y-4">
              {supports.map((l) => (
                <li
                  key={l}
                  className="group flex items-center justify-between border-b border-bone/10 pb-4"
                >
                  <span className="font-display text-2xl md:text-4xl">{l}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-bone/40 transition-colors group-hover:text-violet">
                    {t.proof.played}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingReady() {
  const t = useT();
  return (
    <section className="relative bg-obsidian/40 py-12 md:py-16">
      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          07 · {t.booking.kicker}
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-sm bg-bone/10 md:grid-cols-4">
          {t.booking.cards.map((c, i) => (
            <div key={i} className="bg-void p-6 md:p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
                0{i + 1} — {c.k}
              </span>
              <p className="font-display mt-4 text-lg leading-tight md:text-xl break-words hyphens-auto">
                {c.p}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Inline minimal premium social glyphs (TikTok / Spotify / SoundCloud not in lucide) */
const TikTokIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M19.6 6.6a5.5 5.5 0 0 1-3.2-1V15a5.7 5.7 0 1 1-5.7-5.7c.3 0 .5 0 .8.1v2.6a3.1 3.1 0 1 0 2.2 3V2h2.5a5.4 5.4 0 0 0 3.4 4.6Z" />
  </svg>
);
const SpotifyIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.5 14.4a.7.7 0 0 1-1 .2c-2.7-1.6-6-2-10-1.1a.7.7 0 1 1-.3-1.4c4.3-1 8 -.5 11 1.3.4.2.5.6.3 1Zm1.2-2.7a.9.9 0 0 1-1.2.3c-3-1.9-7.7-2.4-11.3-1.3a.9.9 0 1 1-.5-1.7c4.1-1.2 9.3-.7 12.7 1.4.4.3.6.8.3 1.3Zm.1-2.8c-3.7-2.2-9.8-2.4-13.3-1.3a1.1 1.1 0 1 1-.6-2c4-1.2 10.7-1 14.9 1.5a1.1 1.1 0 1 1-1 2Z" />
  </svg>
);
const SoundCloudIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M2 15c0 .8.2 1.5.5 2v-4c-.3.6-.5 1.3-.5 2Zm2 3c.3.1.6.1 1 .1V11.9a2 2 0 0 0-1 .2v6Zm2 .1c.3 0 .7 0 1-.1V11c-.3-.1-.7-.1-1-.1v7.2Zm2-.1c.3 0 .7 0 1 .1V10.7c-.3-.1-.7-.1-1 0v7.3Zm9-9.5c-.6 0-1.1.1-1.6.4-.4-3.5-3.4-6.2-7.1-6.2a7 7 0 0 0-2.3.4v15h11a4 4 0 0 0 0-7.6Z" />
  </svg>
);

function ContactFinal() {
  const t = useT();
  const links: { label: string; href: string; Icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement }[] = [
    { label: "Instagram", href: SOCIALS.instagram, Icon: (p) => <Instagram {...p} /> },
    { label: "TikTok", href: SOCIALS.tiktok, Icon: TikTokIcon },
    { label: "Spotify", href: SOCIALS.spotify, Icon: SpotifyIcon },
    { label: "YouTube", href: SOCIALS.youtube, Icon: (p) => <Youtube {...p} /> },
    { label: "SoundCloud", href: SOCIALS.soundcloud, Icon: SoundCloudIcon },
  ];

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-void py-14 md:py-20"
    >
      <div className="absolute inset-0 -z-10 smoke drift opacity-70" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_60%,oklch(0.55_0.28_295/0.35),transparent_55%)]" />

      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          08 · {t.contact.kicker}
        </div>
        <h2 className="font-display mt-6 text-balance text-[clamp(3.5rem,9vw,7rem)] leading-[0.85]">
          {t.contact.headline[0]}
          <br />
          <span className="text-violet">{t.contact.headline[1]}</span>
        </h2>

        <div className="mt-10 flex flex-col gap-3">
          <a
            href={`mailto:${t.contact.mail}`}
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-violet bg-violet px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone transition-all hover:shadow-[0_0_50px_var(--violet)]"
          >
            <span>{t.contact.cta}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href={`mailto:${t.contact.mail}`}
            className="font-mono text-xs uppercase tracking-widest text-bone/60 hover:text-bone"
          >
            {t.contact.mail}
          </a>
        </div>

        {/* premium social row — minimal icons */}
        <div className="mt-16 flex flex-wrap items-center gap-3 md:gap-4">
          {links.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-bone/15 bg-bone/[0.03] text-bone/70 backdrop-blur transition-all hover:border-violet/60 hover:bg-violet/10 hover:text-bone hover:shadow-[0_0_30px_-5px_var(--violet)] md:h-14 md:w-14"
            >
              <Icon className="h-5 w-5 md:h-6 md:w-6" />
            </a>
          ))}
        </div>

        <div className="mt-24 text-center">
          <ChromeSignature text={t.contact.end} />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-bone/10 bg-void px-5 py-8 md:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/40">
        <span>© IXAN BOY · 2026</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-violet pulse-glow" />
          {t.footer.signal}
        </span>
        <span>{t.footer.style}</span>
      </div>
    </footer>
  );
}

// silence unused
void Music2;
