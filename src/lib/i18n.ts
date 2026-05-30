import { createContext, useContext } from "react";

export type Lang = "fr" | "en";

export const dict = {
  fr: {
    nav: { live: "Live Edit", booking: "Booking" },
    hero: {
      sub: "Hardstyle / Raw",
      intro:
        "Une signature hardstyle / raw française construite pour imposer une intensité absolue en live.",
      tag: "Emotion before destruction.",
    },
    pulse: { state: "SIGNAL ACTIF", feed: "TRANSMISSION ACTIVE" },
    presentation: {
      kicker: "Présentation",
      title: "La précision avant le chaos.",
      paragraphs: [
        "IXAN BOY ne copie pas ses influences — il les dissèque pour construire son propre langage.",
        "Musicien multi-instrumentiste et ingénieur son de formation, IXAN BOY construit ses tracks comme une partition — chaque détail sonore orchestré avec une précision chirurgicale.",
        "Chaque montée est calculée. Chaque impact est amplifié.",
      ],
    },
    live: {
      kicker: "Expérience Live",
      headline: ["Construit", "pour l’impact."],
      side: [],
    },
    why: {
      kicker: "Signaux de crédibilité",
      title: "Pourquoi booker IXAN BOY ?",
      cards: [
        {
          k: "01 — Crédibilité Labels",
          h: "Déjà repéré par les structures qui façonnent le raw moderne.",
          p: "Signé chez Scantraxx Prospexx et Hardstyle France.",
        },
        {
          k: "02 — Identité sonore",
          h: "Rien n’est laissé au hasard.",
          p: ["Installer l’attente.", "Déclencher la réaction.", "Laisser une empreinte."],
        },
        {
          k: "03 — Relais scène",
          h: "Des morceaux déjà joués en set par :",
          artists: ["Kronos", "Damien RK", "Fury", "Miss Pepper"],
          p: "Des productions déjà intégrées dans l’écosystème raw actuel.",
        },
      ],
    },
    silence: "Le silence prépare l’impact.",
    tracks: {
      kicker: "Matière Sonore",
      title: "Deux morceaux. Deux visions.",
      list: [
        { title: "Take Me Body", mood: "Émotion · Montée · Rupture" },
        { title: "Sex Bomb", mood: "Tension · Précision · Impact" },
      ],
    },
    dna: {
      kicker: "ADN Musical",
      title: "Le silence avant la frappe.",
      intro: [
        "Des mélodies construites pour installer la tension.",
        "Des impacts pensés pour la détruire.",
      ],
      bodyKicker: "ADN sonore IXAN",
      body: "IXAN BOY développe une approche du raw basée sur la précision et le contrôle. Ses kicks ne cherchent pas uniquement la violence : ils amplifient la sensation d’impact jusqu’à créer une tension physique. Chaque détail sonore est travaillé pour pousser l’intensité encore plus loin, sans jamais perdre la maîtrise.",
    },
    proof: {
      kicker: "Soutiens & Labels",
      labels: "Labels",
      supports: "Supports",
      played: "Joué",
    },
    booking: {
      kicker: "Booking",
      cards: [
        { k: "Management", p: "Communication rapide et structurée." },
        { k: "Live Format", p: "Pensé pour clubs et scènes festival." },
        { k: "Performance", p: "Une identité sonore déjà reconnaissable." },
        { k: "Vision", p: "Un projet construit pour évoluer vite." },
      ],
    },
    contact: {
      kicker: "Contact Booking",
      headline: ["Booker", "IXAN BOY."],
      cta: "Réserver IXAN BOY",
      mail: "booking@ixanboy.com",
      end: "Emotion before destruction.",
    },
    footer: { signal: "SIGNAL · STABLE", style: "HARDSTYLE / RAW" },
  },
  en: {
    nav: { live: "Live Edit", booking: "Booking" },
    hero: {
      sub: "Hardstyle / Raw",
      intro:
        "A French hardstyle / raw signature built to impose absolute intensity on stage.",
      tag: "Emotion before destruction.",
    },
    pulse: { state: "SIGNAL ACTIVE", feed: "LIVE FEED" },
    presentation: {
      kicker: "Presentation",
      title: "Precision before chaos.",
      paragraphs: [
        "IXAN BOY doesn’t copy his influences — he dissects them to build his own language.",
        "Musician, producer and trained sound engineer, IXAN BOY shapes a hardstyle/raw where melodies carry you, tension keeps rising and every sonic detail is orchestrated with surgical precision to form a true raw symphony.",
        "Every build-up is calculated. Every impact is amplified.",
        "Since 2020, IXAN BOY has been shaping an identity built around tension, control and sonic precision.",
      ],
    },
    live: {
      kicker: "Live Experience",
      headline: ["Built", "for impact."],
      side: [],
    },
    why: {
      kicker: "Credibility signals",
      title: "Why book IXAN BOY?",
      cards: [
        {
          k: "01 — Label credibility",
          h: "Already spotted by the structures shaping modern raw.",
          p: "Signed on Scantraxx Prospexx and Hardstyle France.",
        },
        {
          k: "02 — Sonic identity",
          h: "Nothing is left to chance.",
          p: ["Set the wait.", "Trigger the reaction.", "Leave a mark."],
        },
        {
          k: "03 — Stage relays",
          h: "Tracks already played in sets by:",
          artists: ["Kronos", "Damien RK", "Fury", "Miss Pepper"],
          p: "Productions already circulating in today’s raw ecosystem.",
        },
      ],
    },
    silence: "Silence prepares the impact.",
    tracks: {
      kicker: "Sonic Matter",
      title: "Two tracks. Two visions.",
      list: [
        { title: "Take Me Body", mood: "Emotion · Rise · Break" },
        { title: "Sex Bomb", mood: "Tension · Precision · Impact" },
      ],
    },
    dna: {
      kicker: "Musical DNA",
      title: "The silence before the strike.",
      intro: [
        "Melodies built to install the tension.",
        "Impacts designed to destroy it.",
      ],
      bodyKicker: "IXAN sonic DNA",
      body: "IXAN BOY develops a take on raw rooted in precision and control. His kicks don’t only chase violence: they amplify the sensation of impact until it becomes physical tension. Every sonic detail is engineered to push the intensity further, without ever losing control.",
    },
    proof: {
      kicker: "Supports & Labels",
      labels: "Labels",
      supports: "Supports",
      played: "Played",
    },
    booking: {
      kicker: "Booking",
      cards: [
        { k: "Management", p: "Fast, structured communication." },
        { k: "Live Format", p: "Built for clubs and festival stages." },
        { k: "Performance", p: "A sonic identity already recognizable." },
        { k: "Vision", p: "A project built to scale fast." },
      ],
    },
    contact: {
      kicker: "Booking Contact",
      headline: ["Book", "IXAN BOY."],
      cta: "Book IXAN BOY",
      mail: "booking@ixanboy.com",
      end: "Emotion before destruction.",
    },
    footer: { signal: "SIGNAL · STABLE", style: "HARDSTYLE / RAW" },
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
