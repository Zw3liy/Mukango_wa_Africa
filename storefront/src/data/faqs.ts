export interface FAQItem {
  id: string;
  category: "craft_materials" | "orders_custom" | "shipping_delivery" | "care_warranty";
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    id: "faq-timber-sourcing",
    category: "craft_materials",
    question: "Where do you source your hardwoods?",
    answer: "We source exclusively indigenous Zambian hardwoods — including Zambezi Teak (Baikiaea plurijuga), Mukwa/Kiaat (Pterocarpus angolensis), and salvaged African railway timber — through certified government concessions and salvage permits. We never purchase unsustainably harvested timber.",
  },
  {
    id: "faq-bespoke-process",
    category: "orders_custom",
    question: "How does the bespoke commission process work?",
    answer: "Our bespoke journey begins with an initial consultation to discuss your room layout, desired timber species, and motifs. We then prepare architectural 3D sketches and timber grain samples. Once approved, our master carvers begin handcrafting, sharing weekly workshop photo updates. Lead times range between 4 to 8 weeks depending on scale.",
  },
  {
    id: "faq-international-shipping",
    category: "shipping_delivery",
    question: "Do you ship internationally?",
    answer: "Yes, we ship globally to over 25 countries across Europe, North America, the Middle East, and Africa. All international shipments are crated in custom phytosanitary-certified ISPM-15 wooden crates with comprehensive maritime/air cargo insurance.",
  },
  {
    id: "faq-heirloom-guarantee",
    category: "care_warranty",
    question: "What is the Mukango Heirloom Guarantee?",
    answer: "Every piece carrying our heirloom seal includes a 25-year structural warranty against joint failure and timber delamination. Each piece is engraved with an individual registry number and comes with a Certificate of Authenticity signed by master craftsman Chiwama Kennedy Daka.",
  },
  {
    id: "faq-climate-acclimation",
    category: "care_warranty",
    question: "Will the wood crack in colder or dry European/American climates?",
    answer: "No. All our timber undergoes intensive solar and vacuum kiln seasoning down to 8–10% equilibrium moisture content before joinery. This prevents cracking, shrinking, or warping in indoor central-heating or air-conditioned environments.",
  },
  {
    id: "faq-showroom-visits",
    category: "orders_custom",
    question: "Can I visit your atelier in Lusaka?",
    answer: "Yes! Our flagship showroom and active carving studio is located at Plot 14, Kafue Road, Lusaka, Zambia. We welcome private walkthroughs Monday through Saturday. Sunday visits are available by appointment.",
  },
];
