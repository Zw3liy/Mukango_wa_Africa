import { WoodFinish } from "../types/product";

export interface TimberInfo {
  id: string;
  name: string;
  botanicalName: string;
  origin: string;
  character: string;
  sustainability: string;
  jankaHardness: string;
  finishes: WoodFinish[];
}

export const WOOD_FINISHES: WoodFinish[] = [
  {
    id: "natural-wax",
    name: "Natural Beeswax & Linseed",
    colorHex: "#8B5A2B",
    description: "Hand-rubbed organic beeswax and cold-pressed linseed oil preserving raw golden grain warmth.",
  },
  {
    id: "deep-ebonized",
    name: "Ebonized Charcoal",
    colorHex: "#221F1E",
    description: "Traditional iron-vinegar reaction creating a deep, velvety matte black without obscuring natural grain texture.",
  },
  {
    id: "aged-safari",
    name: "Aged Safari Ochre",
    colorHex: "#5E3A1A",
    description: "Sun-cured mineral tone evoking the weathered patinas of Zambian bushveld timber.",
  },
  {
    id: "smoked-mukwa",
    name: "Smoked Mukwa Umber",
    colorHex: "#452818",
    description: "Rich dark honey-brown with crimson undertones, sealed with matte waterborne lacquer.",
  },
];

export const TIMBER_REGISTRY: TimberInfo[] = [
  {
    id: "zambezi-teak",
    name: "Zambezi Teak",
    botanicalName: "Baikiaea plurijuga",
    origin: "Western Province & Livingstone, Zambia",
    character: "Extremely dense, deep reddish-brown with dramatic dark streaks. Naturally resistant to termites and moisture.",
    sustainability: "Harvested under community forestry concessions and deadfall salvage licenses in the Barotse basin.",
    jankaHardness: "2,050 lbf (Extraordinarily durable)",
    finishes: WOOD_FINISHES,
  },
  {
    id: "mukwa-kiaat",
    name: "Mukwa (Kiaat / Bloodwood)",
    botanicalName: "Pterocarpus angolensis",
    origin: "Southern & Central Zambia",
    character: "Warm golden-brown heartwood with blood-red streaks. Remarkable dimensional stability and workability.",
    sustainability: "Felled selectively through government-monitored quotas supporting rural artisan cooperatives.",
    jankaHardness: "1,400 lbf (Strong heirloom furniture timber)",
    finishes: WOOD_FINISHES,
  },
  {
    id: "african-blackwood",
    name: "African Blackwood (Mpingo)",
    botanicalName: "Dalbergia melanoxylon",
    origin: "East & Southern Africa",
    character: "Lustrous pitch black with violet undertones. One of the densest and most sonorous woods on Earth.",
    sustainability: "Micro-harvested exclusively for decorative inlay, sculptural accents, and ergonomic joinery pegs.",
    jankaHardness: "3,670 lbf (Ultra-dense tone wood)",
    finishes: [WOOD_FINISHES[0], WOOD_FINISHES[1]],
  },
  {
    id: "reclaimed-hardwood",
    name: "Reclaimed African Hardwood",
    botanicalName: "Salvaged Zambian Railway & Architectural Hardwoods",
    origin: "Historic railway corridors & heritage structures across Zambia",
    character: "Centuries of natural weathering, iron nail markings, and distinctive weathered patina.",
    sustainability: "100% circular upcycling, preventing the harvesting of living forest stands.",
    jankaHardness: "2,200+ lbf",
    finishes: [WOOD_FINISHES[0], WOOD_FINISHES[2]],
  },
];
