import { createContext, useContext } from "react";

export type Lang = "fr" | "en";

export const dict = {
  fr: {
    nav: { listen: "Écouter", live: "Live Edit", booking: "Booking", socials: "Réseaux" },
    hero: {
      tag: "Emotion before destruction.",
      sub: "Hardstyle — Raw",
      ready: "Festival ready · 2025",
    },
    pulse: { label: "BPM", state: "LIVE SIGNAL" },
    live: {
      kicker: "Experience Live",
      lines: ["Construit pour l'impact.", "Tension mélodique. Libération violente."],
    },
    why: {
      title: "Pourquoi booker IXAN BOY",
      cards: [
        {
          k: "01 — Crédibilité Labels",
          h: "Releases sur Scantraxx Prospexx & Hardstyle France.",
          p: "Un projet déjà signé sur des structures reconnues de la scène.",
        },
        {
          k: "02 — Identité sonore",
          h: "Chaque morceau pensé comme un moment de set.",
          p: "Installer la tension. Déclencher la réaction. Laisser une empreinte.",
        },
        {
          k: "03 — Reconnaissance scène",
          h: "Supports : Kronos · Damien RK · Fury · Miss Pepper.",
          p: "Une signature reconnue par les artistes qui définissent le son raw.",
        },
      ],
    },
    silence: "Le silence avant la frappe.",
    tracks: {
      kicker: "Signature Tracks",
      list: [
        { title: "Through The Fire", mood: "Émotion · Montée · Rupture" },
        { title: "Better Not Run", mood: "Tension · Précision · Impact" },
      ],
    },
    dna: {
      kicker: "Musical DNA",
      body: "Une puissance sous contrôle. Une précision chirurgicale. Chaque kick sculpté pour repousser la limite d'une base déjà massive. Le chaos, parfaitement maîtrisé.",
    },
    proof: { kicker: "Soutiens & Labels", labels: "LABELS", supports: "SUPPORTS" },
    booking: {
      kicker: "Booking Ready",
      lines: [
        "Management structuré.",
        "Réactivité sous 24h.",
        "Format club & festival.",
        "Projet en montée — identité déjà solide.",
      ],
    },
    contact: {
      kicker: "Contact",
      cta: "Réserver IXAN BOY",
      mail: "booking@ixanboy.com",
      end: "Emotion before destruction.",
    },
  },
  en: {
    nav: { listen: "Listen", live: "Live Edit", booking: "Booking", socials: "Socials" },
    hero: {
      tag: "Emotion before destruction.",
      sub: "Hardstyle — Raw",
      ready: "Festival ready · 2025",
    },
    pulse: { label: "BPM", state: "LIVE SIGNAL" },
    live: {
      kicker: "Live Experience",
      lines: ["Built for impact.", "Melodic tension. Violent release."],
    },
    why: {
      title: "Why book IXAN BOY",
      cards: [
        {
          k: "01 — Label credibility",
          h: "Released on Scantraxx Prospexx & Hardstyle France.",
          p: "A project already signed to recognized scene structures.",
        },
        {
          k: "02 — Sonic identity",
          h: "Every track designed as a set moment.",
          p: "Build the tension. Trigger the reaction. Leave a mark.",
        },
        {
          k: "03 — Scene recognition",
          h: "Supports: Kronos · Damien RK · Fury · Miss Pepper.",
          p: "A signature acknowledged by the artists who define the raw sound.",
        },
      ],
    },
    silence: "The silence before the strike.",
    tracks: {
      kicker: "Signature Tracks",
      list: [
        { title: "Through The Fire", mood: "Emotion · Rise · Break" },
        { title: "Better Not Run", mood: "Tension · Precision · Impact" },
      ],
    },
    dna: {
      kicker: "Musical DNA",
      body: "Power under control. Surgical precision. Every kick sculpted to push past the limit of an already massive foundation. Chaos, perfectly mastered.",
    },
    proof: { kicker: "Support & Labels", labels: "LABELS", supports: "SUPPORTS" },
    booking: {
      kicker: "Booking Ready",
      lines: [
        "Structured management.",
        "Response within 24h.",
        "Club & festival format.",
        "A rising project — identity already locked.",
      ],
    },
    contact: {
      kicker: "Contact",
      cta: "Book IXAN BOY",
      mail: "booking@ixanboy.com",
      end: "Emotion before destruction.",
    },
  },
} as const;

export const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "fr",
  setLang: () => {},
});

export const useLang = () => useContext(LangCtx);
export const useT = () => dict[useLang().lang];

export const SOCIALS = {
  instagram: "https://www.instagram.com/ixan_boy",
  tiktok: "https://tiktok.com/@ixan.boy",
  spotify: "https://open.spotify.com/artist/1p3qdaCRJ2ZDOjg93KExJ7",
  youtube: "https://youtube.com/@ixanboy",
  soundcloud: "https://on.soundcloud.com/BscyvbgFBRNjvA0Lpa",
};
