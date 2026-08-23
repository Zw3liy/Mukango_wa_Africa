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
