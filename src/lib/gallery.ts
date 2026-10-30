// Galerie photos auto-alimentée : chaque fichier `src/assets/gallery/<categorie>-<nom>.jpg.asset.json`
// apparaît automatiquement dans la section Photos, rangé dans sa catégorie, avec son bouton
// de téléchargement HD. Catégories reconnues : live, portrait, univers, artwork.

export type GalleryCat = "live" | "portrait" | "univers" | "artwork";
export const GALLERY_CATS: GalleryCat[] = ["live", "portrait", "univers", "artwork"];

export type GalleryItem = { cat: GalleryCat; src: string; name: string; file: string };

const pointers = import.meta.glob<{ url: string; original_filename?: string }>(
  "../assets/gallery/*.asset.json",
  { eager: true, import: "default" },
);

export function categorize(path: string): { cat: GalleryCat; name: string } | null {
  const base = path.split("/").pop()!.replace(/\.asset\.json$/, "").replace(/\.[a-z0-9]+$/i, "");
  const [prefix, ...rest] = base.split("-");
  if (!GALLERY_CATS.includes(prefix as GalleryCat)) return null;
  return { cat: prefix as GalleryCat, name: rest.join("-") || prefix };
}

export const GALLERY: GalleryItem[] = Object.entries(pointers)
  .map(([path, p]) => {
    const c = categorize(path);
    if (!c) return null;
    const file = p.original_filename ?? `ixan-boy-${c.cat}-${c.name}.jpg`;
    return { ...c, src: p.url, file };
  })
  .filter((x): x is GalleryItem => x !== null)
  .sort((a, b) => a.name.localeCompare(b.name));
