import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { Instagram, Music2, Youtube } from "lucide-react";
import { LangCtx, dict, useT, SOCIALS, type Lang } from "@/lib/i18n";
import { startPulse } from "@/lib/pulse";
import { TrackPlayer } from "@/components/epk/TrackPlayer";
import { RevealText } from "@/components/epk/RevealText";
import heroImg from "@/assets/portrait-hero.jpg";
import tunnelImg from "@/assets/portrait-tunnel.jpg";
import logoImg from "@/assets/logo.png";
import coverFire from "@/assets/cover-fire.jpg";
import coverRun from "@/assets/cover-run.jpg";
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
    startPulse();
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
        <TopBar lang={lang} setLang={setLang} />
        <Hero />
        <PulseBar />
        <Presentation />
        <ExperienceLive />
        <WhyBook />
        <Silence />
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

function TopBar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10 md:py-6">
      <div className="flex items-center gap-3">
        <img
          src={logoImg}
          alt="IXAN BOY"
          className="h-7 w-auto md:h-9 drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
        />
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60 sm:inline">
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
    schedule(1200);
    return () => timeouts.forEach((id) => clearTimeout(id));
  }, []);
  return (
    <div key={key} className="sig-scan z-[1]">
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
          className="h-full w-full object-cover object-[center_20%] md:object-[center_30%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-transparent to-void" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent,var(--void)_75%)]" />
        <div className="absolute inset-0 smoke opacity-30 mix-blend-screen drift" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col justify-end px-5 pb-16 md:px-12 md:pb-20"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
          {t.hero.sub}
        </div>
        <h1 className="font-display mt-3 text-[clamp(4rem,16vw,15rem)] leading-[0.85] tracking-tight">
          IXAN
          <br className="md:hidden" />
          <span className="md:ml-6 text-violet">BOY</span>
        </h1>

        <p className="mt-5 max-w-xl text-balance text-sm leading-relaxed text-bone/75 md:text-base">
          {t.hero.intro}
        </p>

        <div className="mt-14 mb-10 sig-reveal">
          <ChromeSignature text={t.hero.tag} />
        </div>

        <div className="mt-2 flex flex-wrap gap-2 md:gap-3">
          <Cta href="#live" label={t.nav.live} primary />
          <Cta href="#contact" label={t.nav.booking} />
        </div>
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
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-all ${
        primary
          ? "border-violet bg-violet text-bone hover:shadow-[0_0_30px_var(--violet)]"
          : "border-bone/20 bg-bone/5 text-bone backdrop-blur hover:border-bone/60"
      }`}
    >
      <span className="relative z-10">{label}</span>
      <span className="relative z-10 transition-transform group-hover:translate-x-1">
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
  return (
    <section className="relative bg-void py-24 md:py-40">
      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          01 · {t.presentation.kicker}
        </div>
        <h2 className="font-display mt-4 text-[clamp(2.25rem,7vw,6rem)] leading-[0.95] text-balance">
          {t.presentation.title}
        </h2>
        <div className="mt-10 grid gap-x-12 gap-y-6 md:mt-14 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-2 space-y-5">
            {t.presentation.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                className={`text-balance ${
                  i === 2
                    ? "font-display text-2xl leading-tight text-bone md:text-4xl"
                    : "text-base leading-relaxed text-bone/80 md:text-lg"
                }`}
              >
                {p}
              </motion.p>
            ))}
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
      className="relative isolate overflow-hidden bg-void py-24 md:py-40"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 smoke drift" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,oklch(0.55_0.28_295/0.4),transparent_60%)]" />
      </div>

      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          02 · {t.live.kicker}
        </div>
        <h2 className="font-display mt-4 text-[clamp(3rem,11vw,9rem)] leading-[0.9]">
          {t.live.headline[0]}
          <br />
          <span className="text-violet">{t.live.headline[1]}</span>
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-bone/10 bg-obsidian">
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
    <section className="relative bg-obsidian/40 py-24 md:py-40">
      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          03 · {t.why.kicker}
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-12">
          {t.why.cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`group relative overflow-hidden rounded-sm border border-bone/10 bg-void/60 p-6 backdrop-blur md:p-8 ${
                i === 0
                  ? "md:col-span-5 md:mt-0"
                  : i === 1
                    ? "md:col-span-4 md:mt-12"
                    : "md:col-span-3 md:mt-4"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
                {c.k}
              </span>
              <h3 className="font-display mt-4 text-2xl leading-tight md:text-3xl">
                {c.h}
              </h3>
              <p className="mt-3 text-sm text-bone/65">{c.p}</p>
              <span className="absolute -bottom-px left-0 h-px w-0 bg-violet transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Silence() {
  const t = useT();
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center bg-void px-5 py-24">
      <RevealText
        text={t.silence}
        className="font-serif-i text-balance text-center text-3xl text-bone/90 md:text-6xl"
      />
    </section>
  );
}

function SignatureTracks() {
  const t = useT();
  const tracks = [
    { ...t.tracks.list[0], cover: coverFire, link: SOCIALS.spotify },
    { ...t.tracks.list[1], cover: coverRun, link: SOCIALS.spotify },
  ];
  return (
    <section id="tracks" className="relative bg-void py-24 md:py-40">
      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          04 · {t.tracks.kicker}
        </div>
        <h2 className="font-display mt-4 text-[clamp(3rem,11vw,9rem)] leading-[0.9]">
          {t.tracks.title}
        </h2>

        <div className="mt-16 space-y-20 md:space-y-32">
          {tracks.map((tr, i) => (
            <motion.div
              key={tr.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`grid gap-8 md:grid-cols-12 md:gap-12 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative md:col-span-5">
                <div className="track-breathe relative aspect-square overflow-hidden rounded-sm border border-bone/10">
                  <img
                    src={tr.cover}
                    alt={tr.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent" />
                  <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/80">
                    TRACK · 0{i + 1}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center md:col-span-7">
                <h3 className="font-display text-5xl leading-none md:text-7xl">
                  {tr.title}
                </h3>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-violet">
                  {tr.mood}
                </p>
                <div className="mt-8">
                  <TrackPlayer title={tr.title} />
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={tr.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] uppercase tracking-widest text-bone/70 underline-offset-4 hover:text-bone hover:underline"
                  >
                    Spotify ↗
                  </a>
                  <a
                    href={SOCIALS.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] uppercase tracking-widest text-bone/70 underline-offset-4 hover:text-bone hover:underline"
                  >
                    YouTube ↗
                  </a>
                  <a
                    href={SOCIALS.soundcloud}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] uppercase tracking-widest text-bone/70 underline-offset-4 hover:text-bone hover:underline"
                  >
                    SoundCloud ↗
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MusicalDNA() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-obsidian/40 py-32 md:py-48">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,oklch(0.62_0.26_15/0.2),transparent_55%)]" />
      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          05 · {t.dna.kicker}
        </div>

        <h2 className="font-display mt-4 text-[clamp(2.5rem,9vw,7.5rem)] leading-[0.9] text-balance uppercase">
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
            <div className="track-breathe relative aspect-[3/4] overflow-hidden rounded-sm border border-bone/10">
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
    <section className="relative bg-void py-24 md:py-32">
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
    <section className="relative bg-obsidian/40 py-24 md:py-32">
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
      className="relative isolate overflow-hidden bg-void py-32 md:py-48"
    >
      <div className="absolute inset-0 -z-10 smoke drift opacity-70" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_60%,oklch(0.55_0.28_295/0.35),transparent_55%)]" />

      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          08 · {t.contact.kicker}
        </div>
        <h2 className="font-display mt-6 text-balance text-[clamp(3rem,14vw,12rem)] leading-[0.85]">
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

        <p className="mt-24 text-center">
          <ChromeSignature text={t.contact.end} />
        </p>
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
