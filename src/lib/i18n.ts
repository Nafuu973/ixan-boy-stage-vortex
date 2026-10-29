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
    setfmt: {
      kicker: "En pratique",
      items: [
        { k: "Durée du set", v: "60–90 min club · 45–60 min festival" },
        { k: "Format", v: "CDJ / USB — pas d'ordinateur" },
        { k: "Sur scène", v: "2 CDJ-3000 · DJM-900 · 1 retour" },
      ],
    },
    presentation: {
      kicker: "Présentation",
      title: "La précision avant le chaos",
      paragraphs: [
        "IXAN BOY ne copie pas ses influences — il les dissèque pour construire son propre langage.",
        "Musicien, producteur et ingénieur son de formation, IXAN BOY façonne un hardstyle/raw où les mélodies embarquent, la tension monte et chaque détail sonore s’orchestre avec une précision chirurgicale pour former une véritable symphonie raw.",
        "Chaque montée est calculée. Chaque impact est amplifié.",
        "Depuis 2020, IXAN BOY façonne une identité construite autour de la tension, du contrôle et de la précision sonore.",
      ],
      specs: [
        { k: "Rôle", v: "Musicien / Producteur" },
        { k: "Formation", v: "Ingénieur son" },
        { k: "Précision", v: "Chirurgicale" },
        { k: "Depuis", v: "2020" },
      ],
    },
    live: {
      kicker: "Expérience Live",
      headline: ["Construit", "pour l’impact"],
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
      title: "Deux morceaux — Deux visions",
      list: [
        { title: "So Dumb", mood: "Émotion · Montée · Rupture" },
        { title: "Sex Bomb", mood: "Tension · Précision · Impact" },
      ],
    },
    dna: {
      kicker: "ADN Musical",
      title: "Le silence avant la frappe",
      intro: [
        "Des mélodies construites pour installer la tension.",
        "Des impacts pensés pour la détruire.",
      ],
      bodyKicker: "ADN sonore IXAN",
      body: "IXAN BOY développe une approche du raw basée sur la précision et le contrôle. Ses kicks ne cherchent pas uniquement la violence : ils amplifient la sensation d’impact jusqu’à créer une tension physique. Chaque détail sonore est travaillé pour pousser l’intensité encore plus loin, sans jamais perdre la maîtrise.",
    },
    proof: {
      kicker: "Labels",
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
    photos: {
      kicker: "Photos",
      title: "Le voir, c’est le comprendre",
      intro:
        "Sélection de photos : live, studio et portraits. Toutes les versions HD sont dans le dossier presse.",
      hd: "Toutes les photos en HD",
      captions: ["En live", "Portrait street", "Studio", "Studio — plan large"],
    },
    press: {
      kicker: "Dossier presse",
      title: "Tout pour programmer IXAN BOY",
      intro:
        "Biographie, fiche technique, photos et vidéo live — à transmettre à votre équipe technique ou à votre graphiste.",
      items: [
        { k: "Biographie", p: "Présentation, ADN musical, labels et supports.", f: "PDF · FR / EN" },
        { k: "Fiche technique", p: "Sources, retour de scène, soundcheck, accueil.", f: "PDF · FR / EN" },
        { k: "Photos HD", p: "Portrait, paysage et pochette So Dumb.", f: "JPG / PNG" },
        { k: "Vidéo live", p: "Mix multicam complet — 5 min 42.", f: "MP4 · 58 Mo" },
      ],
      dl: "Télécharger",
    },
    contact: {
      kicker: "Contact Booking",
      headline: ["Booker", "IXAN BOY"],
      cta: "Réserver IXAN BOY",
      mail: "booking.ixanboy@gmail.com",
      fallback: "Si rien ne s'est ouvert :",
      copy: "Copier l'adresse",
      gmail: "Ouvrir dans Gmail",
      end: "Emotion before destruction.",
    },
    footer: { signal: "SIGNAL · STABLE", style: "HARDSTYLE / RAW" },
  },
  en: {
    nav: { live: "Live Edit", booking: "Booking" },
    hero: {
      sub: "Hardstyle / Raw",
      intro: "A French hardstyle / raw signature built to impose absolute intensity on stage.",
      tag: "Emotion before destruction.",
    },
    pulse: { state: "SIGNAL ACTIVE", feed: "LIVE FEED" },
    setfmt: {
      kicker: "In practice",
      items: [
        { k: "Set length", v: "60–90 min club · 45–60 min festival" },
        { k: "Format", v: "CDJ / USB — no laptop" },
        { k: "On stage", v: "2 CDJ-3000 · DJM-900 · 1 monitor" },
      ],
    },
    presentation: {
      kicker: "Presentation",
      title: "Precision before chaos",
      paragraphs: [
        "IXAN BOY doesn’t copy his influences — he dissects them to build his own language.",
        "Musician, producer and trained sound engineer, IXAN BOY shapes a hardstyle/raw where melodies carry you, tension keeps rising and every sonic detail is orchestrated with surgical precision to form a true raw symphony.",
        "Every build-up is calculated. Every impact is amplified.",
        "Since 2020, IXAN BOY has been shaping an identity built around tension, control and sonic precision.",
      ],
      specs: [
        { k: "Role", v: "Musician / Producer" },
        { k: "Training", v: "Sound engineer" },
        { k: "Precision", v: "Surgical" },
        { k: "Since", v: "2020" },
      ],
    },
    live: {
      kicker: "Live Experience",
      headline: ["Built", "for impact"],
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
      title: "Two tracks — Two visions",
      list: [
        { title: "So Dumb", mood: "Emotion · Rise · Break" },
        { title: "Sex Bomb", mood: "Tension · Precision · Impact" },
      ],
    },
    dna: {
      kicker: "Musical DNA",
      title: "The silence before the strike",
      intro: ["Melodies built to install the tension.", "Impacts designed to destroy it."],
      bodyKicker: "IXAN sonic DNA",
      body: "IXAN BOY develops a take on raw rooted in precision and control. His kicks don’t only chase violence: they amplify the sensation of impact until it becomes physical tension. Every sonic detail is engineered to push the intensity further, without ever losing control.",
    },
    proof: {
      kicker: "Labels",
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
    photos: {
      kicker: "Photos",
      title: "Seeing is understanding",
      intro:
        "Photo selection: live, studio and portraits. All HD versions are in the press kit.",
      hd: "All photos in HD",
      captions: ["Live", "Street portrait", "Studio", "Studio — wide"],
    },
    press: {
      kicker: "Press kit",
      title: "Everything you need to book IXAN BOY",
      intro:
        "Biography, tech rider, photos and live video — ready to forward to your technical team or your designer.",
      items: [
        { k: "Biography", p: "Presentation, musical DNA, labels and supports.", f: "PDF · FR / EN" },
        { k: "Tech rider", p: "Sources, booth monitor, soundcheck, hospitality.", f: "PDF · FR / EN" },
        { k: "HD photos", p: "Portrait, landscape and So Dumb artwork.", f: "JPG / PNG" },
        { k: "Live video", p: "Full multicam mix — 5 min 42.", f: "MP4 · 58 MB" },
      ],
      dl: "Download",
    },
    contact: {
      kicker: "Booking Contact",
      headline: ["Book", "IXAN BOY"],
      cta: "Book IXAN BOY",
      mail: "booking.ixanboy@gmail.com",
      fallback: "If nothing opened:",
      copy: "Copy address",
      gmail: "Open in Gmail",
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
