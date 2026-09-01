export interface JournalArticle {
  id: string;
  slug: string;
  issueNumber: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string[];
  author: {
    name: string;
    role: string;
  };
  publishedDate: string;
  readTimeMinutes: number;
  image: string;
  tags: string[];
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: "journal-sustainable-hardwood-harvesting",
    slug: "sustainable-zambian-hardwood-harvesting",
    issueNumber: "Material Guide N°03",
    title: "Sustainable Zambian Hardwood Harvesting",
    subtitle: "A field guide to selective forestry, timber traceability, and responsible luxury African furniture.",
    excerpt: "How selective harvesting, chain-of-custody records, and patient seasoning protect Zambia's hardwood forests while supporting heirloom furniture making.",
    content: [
      "Luxury African furniture begins long before a board reaches the bench. Responsible sourcing means selecting mature trees under licensed forestry controls, recording concession and transport documentation, and rejecting timber whose origin cannot be traced.",
      "Selective harvesting preserves younger canopy and seed trees instead of clearing whole stands. At the workshop, each accepted board is logged by species, source region, arrival date, moisture content, and the artisan commission in which it is eventually used.",
      "Long air drying followed by controlled kiln conditioning reduces waste because stable boards are less likely to split during carving or fail after export. The result is a slower but more accountable path from Zambian woodland to a generational interior."
    ],
    author: { name: "Chiwama Kennedy Daka", role: "Founder & Master Craftsman" },
    publishedDate: "August 28, 2026",
    readTimeMinutes: 8,
    image: "/images/craftsmanship.jpg",
    tags: ["Sustainable Forestry", "Zambian Hardwood", "Traceability", "African Furniture"],
  },
  {
    id: "journal-ispm-15-export-guide",
    slug: "ispm-15-african-furniture-export-guide",
    issueNumber: "Export Guide N°02",
    title: "ISPM-15 and Exporting African Furniture",
    subtitle: "What international collectors and design studios should know about compliant timber packaging.",
    excerpt: "A practical overview of ISPM-15 export-crate compliance, phytosanitary preparation, and protected delivery for handcrafted African furniture.",
    content: [
      "ISPM-15 applies to solid-wood packaging materials used in international trade. For an exported dining table or sculptural chair, the shipping crate and timber bracing must be appropriately treated and marked by an authorized provider where the destination requires it.",
      "The furniture itself follows separate destination-specific customs and plant-health requirements. Before dispatch, the atelier records timber species, commercial invoice details, packing specifications, treatment evidence, and the collector's destination so the freight partner can confirm the applicable route.",
      "A compliant crate is also a conservation tool: moisture barriers, edge protection, immobilized components, and insured freight reduce the risk of movement or climate exposure during a long international journey."
    ],
    author: { name: "Mutale Mwila", role: "Lead Architectural Designer" },
    publishedDate: "August 20, 2026",
    readTimeMinutes: 7,
    image: "/images/hero.jpg",
    tags: ["ISPM-15", "Furniture Export", "Phytosanitary", "Global Delivery"],
  },
  {
    id: "journal-artisan-provenance",
    slug: "artisan-provenance-logs-heirloom-furniture",
    issueNumber: "Provenance Log N°01",
    title: "The Artisan Provenance Log",
    subtitle: "Following an heirloom piece from timber ledger to the craftsperson's final signature.",
    excerpt: "Why named makers, material ledgers, workshop milestones, and signed certificates matter when commissioning collectible African furniture.",
    content: [
      "Provenance turns a beautiful object into an accountable cultural record. A Mukango log links the finished piece to its timber species, workshop batch, principal makers, joinery milestones, finish schedule, and completion date.",
      "These records do not replace independent forestry or export documents. They preserve the human chain of custody: who selected the grain, who cut the joints, who carved the narrative relief, and who approved the final surface under workshop light.",
      "For collectors, architects, and hospitality projects, a signed provenance certificate supports future care, restoration, insurance, and intergenerational transfer without reducing the artisan's contribution to anonymous manufacture."
    ],
    author: { name: "Chiwama Kennedy Daka", role: "Founder & Master Craftsman" },
    publishedDate: "August 12, 2026",
    readTimeMinutes: 6,
    image: "/images/craftsmanship.jpg",
    tags: ["Artisan Provenance", "Heirloom Furniture", "Collectible Design", "Lusaka Atelier"],
  },
  {
    id: "journal-mukwa-wood",
    slug: "quiet-language-of-mukwa-wood",
    issueNumber: "Issue N°14",
    title: "The Quiet Language of Mukwa Wood",
    subtitle: "On sourcing, grain, and the decades-old partnership with the Barotse craftsmen of western Zambia.",
    excerpt: "Mukwa is a living diary of the Zambezi basin. Its blood-red sap and golden heartwood tell a story of seasons, soil minerals, and patient sunlight.",
    content: [
      "In the dense miombo woodlands of western Zambia, the Mukwa tree (Pterocarpus angolensis) grows with measured deliberation. When felled sustainably through selective forestry concessions, its inner sapwood bleeds a dark ruby resin that local folklore attributes to the spirit of the earth itself.",
      "In our Lusaka atelier, every slab of Mukwa is cured in climate-controlled solar kilns for four months before touching a carpenter's chisel. This eliminates internal tension and ensures that whether the piece ends up in the humid tropics or the dry heated apartments of Zurich or New York, the timber will never warp, twist, or split.",
      "When you touch a Mukwa dining table, you are feeling forty years of sun-cured grain. We finish each board with organic beeswax and pure cold-pressed linseed oil, allowing the wood to breathe and darken gently into an opulent amber patina over generations."
    ],
    author: {
      name: "Chiwama Kennedy Daka",
      role: "Founder & Master Craftsman",
    },
    publishedDate: "January 14, 2026",
    readTimeMinutes: 6,
    image: "https://images.pexels.com/photos/14781780/pexels-photo-14781780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    tags: ["Timber", "Craftsmanship", "Sustainability", "Zambia"],
  },
  {
    id: "journal-private-commission",
    slug: "a-lodge-a-library-a-lifetime",
    issueNumber: "Issue N°13",
    title: "A Lodge, a Library, a Lifetime",
    subtitle: "Inside the private commission that took three years and twenty-seven hands to complete.",
    excerpt: "How twenty-seven master carvers created bespoke furnishings for an eco-safari library overlooking the Luangwa River.",
    content: [
      "When we were approached in 2023 to design and hand-craft the complete interior furnishings for a riverfront library in South Luangwa National Park, we knew it required an unprecedented dedication to traditional joinery.",
      "Over thirty-six months, twenty-seven master carvers, joiners, and apprentices transformed reclaimed Zambezi Teak from disused colonial railway sleepers into thirty bespoke armchairs, eight reading tables, and towering four-meter bookshelves.",
      "The result is a sacred space of quiet knowledge where guests read beneath hand-chiseled wildlife friezes while elephants bathe on the riverbanks just fifty paces away."
    ],
    author: {
      name: "Mutale Mwila",
      role: "Lead Architectural Designer",
    },
    publishedDate: "December 02, 2025",
    readTimeMinutes: 7,
    image: "https://images.pexels.com/photos/27155225/pexels-photo-27155225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    tags: ["Commissions", "Safari Architecture", "Bespoke", "Heritage"],
  },
  {
    id: "journal-join-by-hand",
    slug: "why-we-still-join-by-hand",
    issueNumber: "Issue N°12",
    title: "Why We Still Join by Hand",
    subtitle: "Mortise, tenon, and the argument against shortcuts — an essay from the workshop floor.",
    excerpt: "Why modern screws and synthetic glues can never replace interlocking wood joinery crafted to last centuries.",
    content: [
      "In an era of flat-pack disposable furniture held together by cam locks and particle board, hand joinery is an act of quiet rebellion. At Mukango Wa Africa, we refuse to use metallic fasteners in our primary structural load-bearing frames.",
      "A wedged through-tenon moves with the wood. As ambient humidity shifts across seasons, the timber expands and contracts in harmony with itself. Fasteners, on the other hand, fight against the natural movement of wood, eventually cracking the fibers from within.",
      "When you purchase an heirloom piece from us, you are investing in furniture engineered to outlive its original owners. That is our promise to our patrons and our homage to the tree."
    ],
    author: {
      name: "Chiwama Kennedy Daka",
      role: "Founder & Master Craftsman",
    },
    publishedDate: "November 18, 2025",
    readTimeMinutes: 5,
    image: "https://images.pexels.com/photos/18375891/pexels-photo-18375891.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    tags: ["Joinery", "Philosophy", "Atelier Notes", "Woodworking"],
  },
];
