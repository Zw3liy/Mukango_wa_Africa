export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  roleOrLocation: string;
  commissionType: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    quote: "The Savannah Throned Chair is the undisputed centerpiece of our home. Every guest stops and asks about the grain and hand-carved relief — it is truly a living work of African sculptural art.",
    author: "Amelia Duarte",
    roleOrLocation: "Lisbon, Portugal",
    commissionType: "Savannah Throned Chair & Side Table",
    rating: 5,
  },
  {
    id: "test-2",
    quote: "We commissioned a 12-seater bespoke dining table for our safari lodge in the South Luangwa. The level of joinery and narrative village carvings exceeded every expectation. It will last a hundred years.",
    author: "James Whitfield",
    roleOrLocation: "Cape Town, South Africa",
    commissionType: "Custom 12-Seater Dining Suite",
    rating: 5,
  },
  {
    id: "test-3",
    quote: "Exquisite pieces, ethically harvested timber, and impeccable customer communication from Lusaka to London. The crating was immaculate and the certificate of authenticity is framed in our study.",
    author: "Chloe Anderson",
    roleOrLocation: "Kensington, London, UK",
    commissionType: "Baobab Credenza & Nkosi Chairs",
    rating: 5,
  },
  {
    id: "test-4",
    quote: "In a world of mass-produced veneer furniture, Mukango Wa Africa is a breath of fresh air. You can smell the beeswax and feel the carver's gouge marks on every surface.",
    author: "Dr. Tendai Moyo",
    roleOrLocation: "Harare, Zimbabwe",
    commissionType: "Okavango Four-Poster Bed",
    rating: 5,
  },
];
