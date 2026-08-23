import { DesignMotif } from "../types/product";

export interface MotifDetail {
  id: DesignMotif;
  title: string;
  subtitle: string;
  description: string;
  philosophicalContext: string;
  image: string;
  artisanTechnique: string;
}

export const DESIGN_MOTIFS: MotifDetail[] = [
  {
    id: "savannah",
    title: "The Savannah Collection",
    subtitle: "Untamed Grace of the African Plains",
    description: "Sweeping organic curves, horn-inspired contours, and fluid wildlife silhouettes reflecting the untamed vitality of the open bushveld.",
    philosophicalContext: "Rooted in the reverence for wide skies, sun-warmed earth, and the ancient migrations across the Zambezi and Luangwa floodplains.",
    image: "https://images.pexels.com/photos/14781780/pexels-photo-14781780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    artisanTechnique: "Relief gouge sculpting, compound parabolic curves, and hand-burnished edges.",
  },
  {
    id: "village-stories",
    title: "Village Stories",
    subtitle: "The Communal Rhythm of African Life",
    description: "Everyday human moments, harvest celebrations, and communal solidarity immortalized across interlocking hardwood panels.",
    philosophicalContext: "Honoring Ubuntu — 'I am because we are' — where furniture serves as an anchor for storytelling, gathering, and generational memory.",
    image: "https://images.pexels.com/photos/27155225/pexels-photo-27155225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    artisanTechnique: "Figurative high-relief panel carving, chip-carved geometric border motifs, and beeswax sealing.",
  },
  {
    id: "big-five",
    title: "Big Five Icons",
    subtitle: "Sculptural Tributes to Sovereign Wildlife",
    description: "Majestic lion mane textures, elephant tusks, rhinoceros horn silhouettes, leopard rosettes, and Cape buffalo horn arches rendered in solid timber.",
    philosophicalContext: "A celebration of Africa's most iconic wildlife sovereigns, reminding us of our stewardship over natural heritage.",
    image: "https://images.pexels.com/photos/18375891/pexels-photo-18375891.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    artisanTechnique: "Anatomical deep-relief wood sculpture, multi-depth texturing, and solid mortise-and-tenon structural framing.",
  },
  {
    id: "traditional",
    title: "Traditional Heritage & Royal Court",
    subtitle: "Sacred Geometry & Barotse Royal Lineage",
    description: "Ceremonial throne proportions, celestial sunbursts, and chevron engravings drawn from centuries of Zambian royal court regalia.",
    philosophicalContext: "Carrying forward the dignity and quiet authority of indigenous chieftaincy and courtly woodworking traditions.",
    image: "https://images.pexels.com/photos/20557234/pexels-photo-20557234.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    artisanTechnique: "Precision chisel fluting, geometric chevron gouging, and brass rivet accents.",
  },
  {
    id: "zambezi-flow",
    title: "Zambezi River Flow",
    subtitle: "Fluid Hydrodynamics in Solid Hardwood",
    description: "Meandering live-edge curves, water-ripple surface carving, and river-stone ergonomics sculpted from single-slab Zambezi Teak.",
    philosophicalContext: "Inspired by the mighty Zambezi River that feeds the Victoria Falls (Mosi-oa-Tunya) and gives life to our homeland.",
    image: "https://images.pexels.com/photos/3099647/pexels-photo-3099647.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    artisanTechnique: "Live-edge grain harmonization, butterfly key splines in contrasting Mpingo, and silk-smooth sanded finishes.",
  },
];
