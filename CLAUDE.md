# IXAN BOY — EPK (one-page)

EPK (electronic press kit) one-page pour l'artiste hardstyle **IXAN BOY**. Site cinématique,
scroll narratif (hero → présentation → live → pourquoi booker → tracks → ADN musical → preuve
sociale → booking → contact), i18n FR/EN, lecteur audio custom avec waveform réactive au signal
(Web Audio API), background teaser audio, smooth scroll Lenis.

Généré à l'origine par Lovable, puis nettoyé (voir "Nettoyage effectué" plus bas) : ce qui reste
est strictement ce qui sert au rendu réel de la page.

## Stack

- **TanStack Start** (React 19, SSR) + **TanStack Router** — une seule route réelle : `/`
- **Tailwind CSS v4** (config inline dans `src/styles.css`, pas de `tailwind.config`)
- **Framer Motion** — animations scroll-driven et micro-interactions
- **Lenis** — smooth scroll
- **Web Audio API** (`AnalyserNode`) — waveform réactive à la lecture des morceaux
- Déploiement cible : **Cloudflare** (`wrangler.jsonc`, `@cloudflare/vite-plugin`)

## Structure

```
src/routes/index.tsx     — toute la page (composants section par section, ~1900 lignes)
src/routes/__root.tsx    — shell HTML, meta tags, chargement des polices
src/lib/i18n.ts          — dictionnaire FR/EN + contexte de langue
src/lib/pulse.ts         — pilote --pulse (CSS var) à partir de l'audio en cours de lecture
src/lib/teaser.ts        — lecteur audio de fond en boucle ("Reclaim The Fire"), avec ducking
src/components/epk/RevealText.tsx — texte qui apparaît mot à mot au scroll
src/styles.css           — tokens de couleur (oklch), animations, classes utilitaires custom
src/assets/*.asset.json  — références d'assets hébergés sur le CDN Lovable (résolues par
                            @lovable.dev/vite-tanstack-config au build ; ne pas les traiter
                            comme des imports d'images classiques)
```

Quasiment tout le site vit dans `src/routes/index.tsx` (un composant par section : `Hero`,
`Presentation`, `ExperienceLive`, `WhyBook`, `SignatureTracks`, `MusicalDNA`, `Proof`,
`BookingReady`, `ContactFinal`, `Footer`...).

## Commandes

```
npm install       # installe les dépendances
npm run dev       # serveur de dev (affiche l'URL locale dans le terminal)
npm run build     # build de prod
npm run lint       # eslint
npm run format     # prettier --write
```

## Nettoyage effectué (juillet 2026)

Le repo contenait beaucoup de code mort hérité du scaffold Lovable/shadcn — supprimé sans
toucher au rendu, au contenu ni au comportement :

- **48 composants shadcn/ui** jamais importés par la page (`src/components/ui/*`), + le hook
  `use-mobile` et `lib/utils.ts` (`cn()`) qui n'étaient utilisés que par eux.
- **~40 dépendances npm** orphelines (tous les `@radix-ui/*`, `react-hook-form`, `recharts`,
  `sonner`, `date-fns`, `cmdk`, `vaul`, `embla-carousel-react`, `tw-animate-css`, etc.) —
  `package.json` est passé de 56 à 14 dépendances directes.
- Imports morts et hacks anti-lint dans le code applicatif (`Music2` importé puis `void`-é,
  `__ping`/`currentGainValue` dans `teaser.ts`, deux imports d'assets jamais affichés).
- CSS mort : classes et `@keyframes` jamais appliquées (`glow-editorial`, `kicker-safe`,
  `track-activate-button/cover/eq/now-playing`, `.hero-title` obsolète, etc.).
- Dans `src/lib/pulse.ts` : tout le sous-système de détection de kick/beat (bassFast/bassSlow/
  flux/kick/coverBeat) calculait 5 variables CSS (`--pulse-kick`, `--pulse-activation`,
  `--pulse-low/mid/high`) qui n'étaient lues nulle part — pur travail CPU gâché à chaque frame
  pendant toute la lecture audio. Simplifié pour ne garder que le calcul qui alimente vraiment
  `--pulse` (utilisé par `.pulse-glow` / `.pulse-scale`).

Résultat : 8175 → 3482 lignes de code source (ts/tsx/css), 61 → 13 fichiers, 56 → 14
dépendances directes. Zéro changement visuel ou fonctionnel — vérifié par grep exhaustif +
passage TypeScript en mode syntaxe (pas de build complet possible dans l'environnement où le
nettoyage a été fait, faute d'accès au registre npm — à confirmer avec `npm run build` ici).

## Points d'attention pour la suite

- Les fichiers `*.asset.json` dans `src/assets/` sont un mécanisme spécifique à Lovable
  (référence vers un asset hébergé sur leur CDN `r2_key`/`url`). Si tu ajoutes une nouvelle
  image "normale", importe-la directement (`.png`/`.jpg`) comme les autres assets du dossier —
  pas besoin de ce format sauf si tu repasses par l'éditeur Lovable.
- `package.json` a `"sideEffects": false` — les imports inutilisés sont déjà tree-shakés au
  build, mais évite quand même d'ajouter des dépendances ou composants qui ne seront jamais
  rendus (c'est exactement ce qui vient d'être nettoyé).
- Avant de réintroduire un composant shadcn/ui, vérifie s'il est vraiment nécessaire : la page
  n'a ni formulaire, ni modale, ni menu — tout est construit à la main avec Tailwind + Framer
  Motion.
