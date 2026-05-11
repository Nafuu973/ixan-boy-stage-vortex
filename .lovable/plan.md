
# EPK IXAN BOY — Plan d'exécution

Construction d'un EPK one-page (FR par défaut, toggle EN), mobile-first, pensé comme un set hardstyle : montée → tension → impact → respiration → rupture. Aucun template, tout custom.

## Direction artistique

**Univers :** "Emotion before destruction." — cinématique, métallique, contenu. Pas de RGB gamer, pas de cyberpunk, pas de warehouse techno.

**Palette (tokens dans `src/styles.css`, format oklch) :**
- `--void` noir profond `oklch(0.08 0.01 270)`
- `--obsidian` noir bleuté `oklch(0.14 0.02 270)`
- `--steel` chrome subtil `oklch(0.72 0.01 270)`
- `--bone` blanc cassé intense `oklch(0.97 0.005 90)`
- `--violet` violet électrique signature `oklch(0.55 0.28 295)`
- `--ember` accent magenta-rouge tension `oklch(0.62 0.26 15)` (rare, pour les pics)
- Glow + gradient `--gradient-tension` (violet → ember), `--gradient-smoke` (void → obsidian)

**Typographie :**
- Display : **Anton** ou **Bebas Neue** (titres massifs, condensé, brutalité élégante)
- Accent éditorial : **Instrument Serif** (italique, pour la tagline et les respirations émotionnelles)
- Body : **Inter** tight (400/500), tracking serré, uppercase pour les labels

**Motifs visuels récurrents :**
- Fumée volumétrique (radial gradients animés + noise SVG)
- Lignes verticales fines (rappel de waveform / barres de strobe)
- Compteurs/timecodes monospace en coin (style trailer)
- Glitch contrôlé sur les transitions de section uniquement
- Grain filmique subtil overlay full-page

## Stack technique

- TanStack Start (déjà en place) — single route `/` (one-page) + sous-route `/en` ou paramètre i18n
- Tailwind v4 + tokens oklch dans `src/styles.css`
- Framer Motion pour micro-interactions et scroll-driven animations (`useScroll`, `useTransform`)
- Lenis pour smooth scroll cinématique
- Web Audio API + AnalyserNode pour la waveform/FFT réactive sur le player (réponse "Les deux")
- Mode "simulation" par défaut : pulsations scriptées sur BPM 150 (hardstyle), bascule en mode audio-réel quand le visiteur lance la lecture
- Aucun backend nécessaire pour le MVP — médias statiques dans `public/`

## Structure du site (scroll narratif)

```
0. PRELOADER         → logo IXAN BOY qui se charge en compteur (00 → 100), kick final, fade
1. HERO              → portrait + fumée, tagline "Emotion before destruction.", 4 CTA
2. PULSE (transition)→ bande noire, ligne de waveform qui traverse, BPM affiché
3. EXPERIENCE LIVE   → vidéo multicam plein écran, citations courtes en overlay
4. WHY BOOK          → 3 cartes asymétriques (Labels / Identité sonore / Reconnaissance)
5. SILENCE           → respiration totale : noir, une seule phrase italique centrée
6. SIGNATURE TRACKS  → 2 tracks (Through The Fire, Better Not Run), covers + player + visualizer
7. MUSICAL DNA       → texte cinématique scroll-révélé mot par mot
8. PROOF             → mur logos labels + supports artistes (Kronos, Damien RK, Fury, Miss Pepper)
9. BOOKING READY     → bloc pro rassurant, ton mesuré (projet en évolution)
10. CONTACT FINAL    → CTA booking massif + tous les réseaux + signature
11. FOOTER           → minimal, timecode + tagline
```

## Détail des sections clés

**Hero**
- Background : portrait shooting (que tu fournis) avec masque radial fumée + grain animé
- Titre : "IXAN BOY" en Anton 18vw, lettres qui s'écartent légèrement au scroll
- Tagline italique Instrument Serif sous le nom
- Pulse dot violette synchro BPM en coin haut droit
- 4 CTA pill-buttons : Écouter / Live Edit / Booking / Réseaux
- Toggle FR/EN discret en haut droite, langue switcher avec animation glitch

**Experience Live**
- `<video>` autoplay muted loop (mix multicam quand tu l'auras — placeholder gradient animé en attendant)
- Overlay : timecode qui défile, citations qui apparaissent/disparaissent au rythme des "kicks" simulés
- Strobe contrôlé : flash blanc 1 frame toutes les 8 mesures max (jamais épileptique)

**Signature Tracks (2 tracks)**
- Layout asymétrique : cover large à gauche, méta + waveform à droite
- Player custom : bouton play minimal, barre de progression = waveform réactive (FFT temps réel)
- Au play : tout le site passe en mode "audio-réactif" — le pulse global sync sur la vraie analyse audio
- Liens directs Spotify/SoundCloud/YouTube par track

**Booking Ready**
- Ton mesuré, pas de survente
- 4 lignes courtes : "Management structuré." / "Réactivité 24h." / "Format club & festival." / "Projet en montée."
- Pas de chiffres bidons

**Contact Final**
- Email booking en grand (à confirmer avec toi)
- Grille réseaux : Instagram, TikTok, Spotify, YouTube, SoundCloud (liens fournis)
- Dernière phrase : "Emotion before destruction." en pleine largeur, fade out sur fondu noir

## Animations & interactions

- **Scroll smooth Lenis**, transitions inter-sections via clip-path reveal
- **Texte mot-par-mot** sur les sections cinématiques (Musical DNA, Silence)
- **Hover CTA** : remplissage violet → ember, micro-shake sur clic
- **Pulse global** : variable CSS `--pulse` mise à jour en JS (rAF) selon mode (BPM simulé ou FFT live), pilote opacités/scales subtilement partout
- **Glitch transitions** : entre Hero→Live et Tracks→DNA uniquement (rare = puissant)
- **Respect `prefers-reduced-motion`** : fallback sans pulse/glitch

## Médias & assets

À uploader par toi (j'intègre dès réception) :
- Logo IXAN BOY
- 2 photos derrière les platines
- 2 photos shooting studio
- Covers de Through The Fire et Better Not Run
- Logos labels (Scantraxx Prospexx, Hardstyle France) + supports artistes
- Vidéo mix multicam (fin de semaine)

En attendant, je place :
- Visuels IA générés cohérents avec la DA (portrait fumée, textures métal) à remplacer
- Vidéo : section avec gradient animé + grain + slot prêt à recevoir le `<video>`
- Email booking placeholder à remplacer

## Structure fichiers

```
src/
  routes/
    index.tsx                    → page unique, assemble les sections
    __root.tsx                   → SEO meta, fonts, smooth scroll provider
  components/
    epk/
      Preloader.tsx
      Hero.tsx
      PulseBar.tsx
      ExperienceLive.tsx
      WhyBook.tsx
      Silence.tsx
      SignatureTracks.tsx
      TrackPlayer.tsx            → Web Audio + visualizer
      MusicalDNA.tsx
      Proof.tsx
      BookingReady.tsx
      ContactFinal.tsx
      Footer.tsx
      LangSwitcher.tsx
      GrainOverlay.tsx
    motion/
      RevealText.tsx             → mot-par-mot
      GlitchTransition.tsx
  lib/
    pulse.ts                     → store global du pulse (BPM sim + FFT live)
    i18n.ts                      → dict FR/EN
  styles.css                     → tokens oklch + utilities
public/
  media/                         → vidéo, images, covers (à uploader)
  fonts/                         → si besoin local
```

## Livraison en 2 phases

**Phase 1 (ce que je construis maintenant)** : structure complète, DA, animations, contenus textuels FR+EN, mode simulation pulse, placeholders propres. Site déjà démontrable.

**Phase 2 (après tes uploads)** : remplacement des médias, branchement vidéo réelle, audio réel sur les 2 tracks, ajustements finaux.

Confirme-moi juste l'**email booking** à afficher (sinon je mets un placeholder `booking@ixanboy.com` à remplacer) et je lance la construction.
