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
      title: "Disséquer pour mieux frapper.",
      paragraphs: [
        "IXAN BOY ne copie pas ses influences — il les dissèque pour construire son propre langage.",
        "Musicien et ingénieur son de formation, il développe un hardstyle / raw où la tension mélodique prépare des impacts d’une précision chirurgicale.",
        "Chaque montée est calculée. Chaque impact est amplifié.",
        "Découvertes des platines vinyles à 15 ans, immersion dans l’univers techno, hardcore et hardstyle façonnée par Thunderdome, puis années d’analyse sonore autour de Wildstylez, Ran-D, Regain, D-Sturb ou Kronos : IXAN BOY construit depuis 2020 une identité pensée pour l’impact live.",
      ],
    },
    live: {
      kicker: "Expérience Live",
      headline: ["Construit", "pour l’impact."],
      side: ["Construit pour l’impact.", "Le silence prépare l’impact."],
    },
    why: {
      kicker: "Pourquoi booker IXAN BOY",
      cards: [
        {
          k: "01 — Crédibilité Labels",
          h: "Déjà repéré par les structures qui façonnent le raw moderne.",
          p: "Signé sur Scantraxx Prospexx & Hardstyle France.",
        },
        {
          k: "02 — Identité sonore",
          h: "Chaque morceau pensé comme une mécanique de tension.",
          p: "Installer l’attente. Déclencher la réaction. Laisser une empreinte.",
        },
        {
          k: "03 — Reconnaissance scène",
          h: "Ses productions trouvent des relais dans les sets de Kronos, Damien RK, Fury, Miss Pepper.",
          p: "Une signature déjà identifiée par les artistes qui définissent le raw moderne.",
        },
      ],
    },
    silence: "Le silence prépare l’impact.",
    tracks: {
      kicker: "Signature Tracks",
      title: "Signature.",
      list: [
        { title: "Through The Fire", mood: "Émotion · Montée · Rupture" },
        { title: "Better Not Run", mood: "Tension · Précision · Impact" },
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
      title: "Dissect to strike harder.",
      paragraphs: [
        "IXAN BOY doesn’t copy his influences — he dissects them to build his own language.",
        "Musician and trained sound engineer, he develops a hardstyle / raw where melodic tension prepares impacts of surgical precision.",
        "Every build-up is calculated. Every impact is amplified.",
        "Discovering vinyl turntables at 15, an immersion into techno, hardcore and hardstyle shaped by Thunderdome, then years of sonic analysis around Wildstylez, Ran-D, Regain, D-Sturb or Kronos: since 2020 IXAN BOY has been crafting an identity built for live impact.",
      ],
    },
    live: {
      kicker: "Live Experience",
      headline: ["Built", "for impact."],
      side: ["Built for impact.", "Silence prepares the impact."],
    },
    why: {
      kicker: "Why book IXAN BOY",
      cards: [
        {
          k: "01 — Label credibility",
          h: "Already spotted by the structures shaping modern raw.",
          p: "Signed on Scantraxx Prospexx & Hardstyle France.",
        },
        {
          k: "02 — Sonic identity",
          h: "Every track engineered as a tension mechanism.",
          p: "Set the wait. Trigger the reaction. Leave a mark.",
        },
        {
          k: "03 — Scene recognition",
          h: "His productions are already played by Kronos, Damien RK, Fury, Miss Pepper.",
          p: "A signature acknowledged by the artists defining modern raw.",
        },
      ],
    },
    silence: "Silence prepares the impact.",
    tracks: {
      kicker: "Signature Tracks",
      title: "Signature.",
      list: [
        { title: "Through The Fire", mood: "Emotion · Rise · Break" },
        { title: "Better Not Run", mood: "Tension · Precision · Impact" },
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
