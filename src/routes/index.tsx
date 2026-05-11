import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { LangCtx, dict, useT, SOCIALS, type Lang } from "@/lib/i18n";
import { startPulse } from "@/lib/pulse";
import { TrackPlayer } from "@/components/epk/TrackPlayer";
import { RevealText } from "@/components/epk/RevealText";
import heroImg from "@/assets/portrait-hero.jpg";
import tunnelImg from "@/assets/portrait-tunnel.jpg";
import logoImg from "@/assets/logo.png";
import coverFire from "@/assets/cover-fire.jpg";
import coverRun from "@/assets/cover-run.jpg";
import liveDecks from "@/assets/live-decks.jpg";
import liveBooth from "@/assets/live-booth.jpg";
import labelScantraxx from "@/assets/label-scantraxx-round.png";
import labelHFR from "@/assets/label-hardstyle-france-round.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [lang, setLang] = useState<Lang>("fr");
  const [ready, setReady] = useState(false);
  const t = dict[lang];

  useEffect(() => {
    startPulse();
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const tm = setTimeout(() => setReady(true), 1500);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); clearTimeout(tm); };
  }, []);

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <main className="relative bg-void text-bone">
        <Preloader done={ready} />
        <TopBar />
        <Hero />
        <PulseBar />
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

  function TopBar() {
    return (
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10 md:py-6">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="IXAN BOY" className="h-7 w-auto md:h-9 drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60 sm:inline">EPK · 2025</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest">
          {(["fr", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 transition-colors ${lang === l ? "text-bone" : "text-bone/40 hover:text-bone/70"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

function Preloader({ done }: { done: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (done) { setN(100); return; }
    const id = setInterval(() => setN((v) => Math.min(99, v + Math.ceil(Math.random() * 7))), 60);
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
          <img src={logoImg} alt="IXAN BOY" className="h-24 w-auto pulse-scale drop-shadow-[0_0_30px_rgba(167,100,255,0.4)] md:h-32" />
          <div className="flex w-full items-end justify-between px-6 md:px-12">
            <span className="font-display text-3xl md:text-5xl">IXAN BOY</span>
            <span className="font-mono text-lg md:text-2xl text-violet">{String(n).padStart(3, "0")}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const t = useT(); // CTA labels not language-critical visually, simplified
  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] w-full overflow-hidden">
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

      <motion.div style={{ opacity }} className="relative z-10 flex h-full flex-col justify-end px-5 pb-16 md:px-12 md:pb-20">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
          {t.hero.sub} · {t.hero.ready}
        </div>
        <h1 className="font-display mt-3 text-[clamp(4rem,16vw,15rem)] leading-[0.85] tracking-tight">
          IXAN<br className="md:hidden" /><span className="md:ml-6">BOY</span>
        </h1>
        <p className="font-serif-i mt-4 text-xl text-bone/85 md:text-3xl">
          {t.hero.tag}
        </p>
        <div className="mt-7 flex flex-wrap gap-2 md:gap-3">
          <Cta href="#tracks" label={t.nav.listen} primary />
          <Cta href="#live" label={t.nav.live} />
          <Cta href="#contact" label={t.nav.booking} />
          <Cta href="#contact" label={t.nav.socials} />
        </div>
      </motion.div>

      {/* scan line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-violet/40 scanline" />
    </section>
  );
}

function Cta({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
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
      <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
    </a>
  );
}

function PulseBar() {
  return (
    <section className="relative border-y border-bone/10 bg-obsidian/60 py-5 overflow-hidden">
      <div className="flex items-center gap-6 whitespace-nowrap px-5 md:px-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">▲ LIVE SIGNAL</span>
        <div className="flex h-6 flex-1 items-end gap-[2px]">
          {Array.from({ length: 80 }).map((_, i) => (
            <span
              key={i}
              className="flex-1 bg-bone/60"
              style={{
                height: `calc(${15 + Math.abs(Math.sin(i * 0.4)) * 70}% * (0.6 + var(--pulse) * 0.9))`,
                opacity: 0.5 + Math.sin(i * 0.3) * 0.3,
              }}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">150 BPM</span>
      </div>
    </section>
  );
}

function ExperienceLive() {
  const t = useT();
  return (
    <section id="live" className="relative isolate overflow-hidden bg-void py-24 md:py-40">
      {/* video placeholder — animated gradient until real footage */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 smoke drift" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,oklch(0.55_0.28_295/0.4),transparent_60%)]" />
      </div>

      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
          02 · {t.live.kicker}
        </div>
        <h2 className="font-display mt-4 text-[clamp(3rem,11vw,9rem)] leading-[0.9]">
          BUILT<br />FOR <span className="text-stroke">IMPACT</span>.
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
              {/* color & vignette grading */}
              <div className="absolute inset-0 bg-void/55 mix-blend-multiply" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,oklch(0.55_0.28_295/0.35),transparent_60%)] mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/30" />
              {/* HUD overlay */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/80">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember pulse-glow" />
                  REC · LIVE
                </span>
                <span className="text-bone/50">CAM_01 / 04</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 py-4">
                <span className="font-display text-2xl md:text-4xl leading-none">IXAN BOY</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">150 BPM · RAW</span>
              </div>
              {/* corner brackets */}
              {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((p) => (
                <span key={p} className={`absolute ${p} h-3 w-3 border-violet`} style={{
                  borderTopWidth: p.includes("top") ? 1 : 0,
                  borderBottomWidth: p.includes("bottom") ? 1 : 0,
                  borderLeftWidth: p.includes("left") ? 1 : 0,
                  borderRightWidth: p.includes("right") ? 1 : 0,
                }} />
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-end gap-6 md:col-span-4">
            {t.live.lines.map((l, i) => (
              <p key={i} className="font-serif-i text-2xl leading-tight text-bone/90 md:text-3xl">
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
          03 · {t.why.title}
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
                i === 0 ? "md:col-span-5 md:mt-0" : i === 1 ? "md:col-span-4 md:mt-12" : "md:col-span-3 md:mt-4"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">{c.k}</span>
              <h3 className="font-display mt-4 text-2xl leading-tight md:text-3xl">{c.h}</h3>
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
        className="font-serif-i text-balance text-center text-3xl md:text-6xl text-bone/90"
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
        <h2 className="font-display mt-4 text-[clamp(3rem,11vw,9rem)] leading-[0.9]">SIGNATURE.</h2>

        <div className="mt-16 space-y-20 md:space-y-32">
          {tracks.map((tr, i) => (
            <motion.div
              key={tr.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`grid gap-8 md:grid-cols-12 md:gap-12 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="relative md:col-span-5">
                <div className="relative aspect-square overflow-hidden rounded-sm border border-bone/10 pulse-scale">
                  <img src={tr.cover} alt={tr.title} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent" />
                  <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/80">
                    TRACK · 0{i + 1}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center md:col-span-7">
                <h3 className="font-display text-5xl leading-none md:text-7xl">{tr.title}</h3>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-violet">{tr.mood}</p>
                <div className="mt-8">
                  <TrackPlayer title={tr.title} />
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={tr.link} target="_blank" rel="noreferrer" className="font-mono text-[11px] uppercase tracking-widest text-bone/70 underline-offset-4 hover:text-bone hover:underline">Spotify ↗</a>
                  <a href={SOCIALS.youtube} target="_blank" rel="noreferrer" className="font-mono text-[11px] uppercase tracking-widest text-bone/70 underline-offset-4 hover:text-bone hover:underline">YouTube ↗</a>
                  <a href={SOCIALS.soundcloud} target="_blank" rel="noreferrer" className="font-mono text-[11px] uppercase tracking-widest text-bone/70 underline-offset-4 hover:text-bone hover:underline">SoundCloud ↗</a>
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
        <div className="mt-10 grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <RevealText
              text={t.dna.body}
              className="font-display block text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.05] text-balance"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative md:col-span-5"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-bone/10 pulse-scale">
              <img src={tunnelImg} alt="IXAN BOY" loading="lazy" className="h-full w-full object-cover grayscale-[20%] contrast-110" />
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
      releases: ["Take Me Body", "So Dumb (Sex Bomb)"],
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
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">{t.proof.labels}</span>
            <div className="mt-6 space-y-px overflow-hidden rounded-sm bg-bone/10">
              {labels.map((l) => (
                <div key={l.name} className="group relative grid grid-cols-5 gap-4 bg-obsidian/60 p-5 transition-colors hover:bg-violet/[0.06] md:p-6">
                  <div className="col-span-2 flex items-center justify-center border-r border-bone/10 pr-4">
                    <img
                      src={l.logo}
                      alt={l.name}
                      loading="lazy"
                      className="max-h-20 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105 md:max-h-24"
                    />
                  </div>
                  <div className="col-span-3 flex flex-col justify-center">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-bone/50">
                      {l.name}
                    </span>
                    <ul className="mt-2 space-y-1">
                      {l.releases.map((r) => (
                        <li key={r} className="flex items-center gap-2 font-display text-base leading-tight text-bone/90 md:text-xl">
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
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">{t.proof.supports}</span>
            <ul className="mt-6 space-y-4">
              {supports.map((l) => (
                <li key={l} className="group flex items-center justify-between border-b border-bone/10 pb-4">
                  <span className="font-display text-2xl md:text-4xl">{l}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-bone/40 transition-colors group-hover:text-violet">PLAYED</span>
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
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">07 · {t.booking.kicker}</div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-sm bg-bone/10 md:grid-cols-4">
          {t.booking.lines.map((l, i) => (
            <div key={i} className="bg-void p-6 md:p-8">
              <span className="font-mono text-[10px] uppercase tracking-widest text-violet">0{i + 1}</span>
              <p className="font-display mt-4 text-xl leading-tight md:text-2xl">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactFinal() {
  const t = useT();
  const links: [string, string][] = [
    ["Instagram", SOCIALS.instagram],
    ["TikTok", SOCIALS.tiktok],
    ["Spotify", SOCIALS.spotify],
    ["YouTube", SOCIALS.youtube],
    ["SoundCloud", SOCIALS.soundcloud],
  ];
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-void py-32 md:py-48">
      <div className="absolute inset-0 -z-10 smoke drift opacity-70" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_60%,oklch(0.55_0.28_295/0.35),transparent_55%)]" />

      <div className="px-5 md:px-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">08 · {t.contact.kicker}</div>
        <h2 className="font-display mt-6 text-[clamp(3rem,14vw,12rem)] leading-[0.85] text-balance">
          BOOK<br />IXAN BOY.
        </h2>

        <div className="mt-10 flex flex-col gap-3">
          <a
            href={`mailto:${t.contact.mail}`}
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-violet bg-violet px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone transition-all hover:shadow-[0_0_50px_var(--violet)]"
          >
            <span>{t.contact.cta}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a href={`mailto:${t.contact.mail}`} className="font-mono text-xs uppercase tracking-widest text-bone/60 hover:text-bone">
            {t.contact.mail}
          </a>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-bone/10 md:grid-cols-5">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group bg-void p-6 transition-colors hover:bg-violet/10"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-bone/50 group-hover:text-violet">↗</span>
              <p className="font-display mt-3 text-xl">{label}</p>
            </a>
          ))}
        </div>

        <p className="font-serif-i mt-24 text-balance text-center text-4xl text-bone/90 md:text-7xl">
          {t.contact.end}
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-void px-5 py-8 md:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/40">
        <span>© IXAN BOY · 2025</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-violet pulse-glow" />
          SIGNAL · STABLE
        </span>
        <span>HARDSTYLE / RAW</span>
      </div>
    </footer>
  );
}
