import { useState, useEffect } from "react";

/* ------------------------------- Data ------------------------------- */

const NAV = [
  { label: "Collection", href: "#collection" },
  { label: "Heritage", href: "#heritage" },
  { label: "Craftsmanship", href: "#craftsmanship" },
  { label: "Journal", href: "#journal" },
  { label: "Atelier", href: "#atelier" },
  { label: "Contact", href: "#contact" },
];

const PRODUCTS = [
  {
    name: "Serengeti Dining Table",
    category: "Dining",
    price: "From $4,800",
    image:
      "https://images.pexels.com/photos/14781780/pexels-photo-14781780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    tag: "Signature",
  },
  {
    name: "Mara Carver Chair",
    category: "Seating",
    price: "From $1,250",
    image:
      "https://images.pexels.com/photos/27155225/pexels-photo-27155225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    tag: "Hand-Carved",
  },
  {
    name: "Okavango Four-Poster",
    category: "Bedroom",
    price: "From $7,400",
    image:
      "https://images.pexels.com/photos/18375891/pexels-photo-18375891.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    tag: "Limited",
  },
  {
    name: "Baobab Credenza",
    category: "Storage",
    price: "From $3,600",
    image:
      "https://images.pexels.com/photos/20557234/pexels-photo-20557234.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    tag: "New Season",
  },
  {
    name: "Zambezi Low Table",
    category: "Living",
    price: "From $1,900",
    image:
      "https://images.pexels.com/photos/3099647/pexels-photo-3099647.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    tag: "Signature",
  },
  {
    name: "Kilimanjaro Lamp",
    category: "Lighting",
    price: "From $680",
    image:
      "https://images.pexels.com/photos/20557088/pexels-photo-20557088.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
    tag: "Artisan",
  },
];

const JOURNAL = [
  {
    date: "Issue N°14",
    title: "The quiet language of mukwa wood",
    excerpt:
      "On sourcing, grain, and the decades-old partnership with the Barotse craftsmen of western Zambia.",
  },
  {
    date: "Issue N°13",
    title: "A lodge, a library, a lifetime",
    excerpt:
      "Inside the private commission that took three years and twenty-seven hands to complete.",
  },
  {
    date: "Issue N°12",
    title: "Why we still join by hand",
    excerpt:
      "Mortise, tenon, and the argument against shortcuts — an essay from the workshop floor.",
  },
];

/* ------------------------------- Icons ------------------------------- */

const IconMenu = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
  >
    <line x1="3" y1="7" x2="21" y2="7" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="17" x2="21" y2="17" />
  </svg>
);

const IconClose = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
  >
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

const IconArrow = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ------------------------------- Header ------------------------------- */

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[105] transition-all duration-300 ${
        scrolled || open
          ? "bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]"
          : "bg-white/80 backdrop-blur-sm"
      }`}
      style={{ height: 60 }}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="flex items-baseline gap-2">
          <span
            className="font-serif text-[22px] leading-none tracking-tight"
            style={{ color: "#4F2607" }}
          >
            The African Touch
          </span>
          <span
            className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] sm:inline"
            style={{ color: "#87674F" }}
          >
            Est. 1974
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-5">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[14px] leading-6 transition-colors hover:text-[#87674F] active:text-[#112337]"
              style={{ color: "#4F2607" }}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <button
            className="text-[14px] leading-6 transition-colors hover:text-[#87674F]"
            style={{ color: "#4F2607" }}
          >
            Search
          </button>
          <button
            className="text-[14px] leading-6 transition-colors hover:text-[#87674F]"
            style={{ color: "#4F2607" }}
          >
            Bag (0)
          </button>
        </div>

        <button
          className="lg:hidden flex items-center justify-center w-11 h-11"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{ color: "#4F2607" }}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="border-t border-[#E5E7EB] bg-white"
          style={{ boxShadow: "6.5px 11.3px 19px 0px rgba(0,0,0,0.11)" }}
        >
          <ul className="mx-auto max-w-[1200px] px-5">
            {NAV.map((n) => (
              <li
                key={n.href}
                className="border-b border-[#EEEEEE] last:border-b-0"
              >
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-3 min-h-[48px] text-[16px] leading-6 transition-colors hover:text-[#87674F]"
                  style={{ color: "#4F2607" }}
                >
                  {n.label}
                  <IconArrow className="opacity-50" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------- Hero ------------------------------- */

function Hero() {
  return (
    <section
      id="top"
      className="relative w-full overflow-hidden"
      style={{ height: "min(92vh, 860px)" }}
    >
      <img
        src="/images/hero.jpg"
        alt="African safari lodge interior with handcrafted hardwood furniture at golden hour"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Gradient overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(79,38,7,0.25) 0%, rgba(79,38,7,0.15) 40%, rgba(17,35,55,0.55) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col justify-end px-5 pb-[72px] md:pb-[96px] md:px-8">
        <p
          className="mb-5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/90 animate-fade-up"
        >
          The 2026 Lodge Collection
        </p>
        <h1
          className="max-w-[18ch] font-serif text-white animate-fade-up-delay"
          style={{
            fontSize: "clamp(36px, 6vw, 52px)",
            lineHeight: 1.05,
            fontWeight: 400,
          }}
        >
          Furniture shaped by the land. Made to outlive its makers.
        </h1>
        <p
          className="mt-6 max-w-[46ch] text-white/85 animate-fade-up-delay"
          style={{ fontSize: 16, lineHeight: "24px" }}
        >
          For five decades we have worked beside African artisans, turning
          responsibly harvested hardwoods into pieces worthy of the landscapes
          that inspired them.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-5 animate-fade-up-delay-2">
          <a
            href="#collection"
            className="group inline-flex items-center justify-center text-white transition-all"
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: 20,
              lineHeight: "32px",
              padding: "10px 30px 6px 30px",
              height: 52,
              minWidth: 240,
              backgroundColor: "rgba(79, 38, 7, 0.5)",
              border: "2px solid #FFFFFF",
              borderRadius: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(79, 38, 7, 0.75)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(79, 38, 7, 0.5)")
            }
          >
            Explore the Collection
          </a>
          <a
            href="#heritage"
            className="inline-flex items-center gap-2 text-white transition-colors hover:text-[#FF5A1F]"
            style={{ fontSize: 16, lineHeight: "24px" }}
          >
            Our Heritage
            <IconArrow />
          </a>
        </div>
      </div>

      {/* Bottom caption bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/20 bg-black/10 backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3 text-white/80 md:px-8">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "#FF5A1F" }}
          >
            Scroll
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em]">
            N°50 · Autumn Edition
          </span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Heritage ------------------------------- */

function Heritage() {
  return (
    <section
      id="heritage"
      className="w-full"
      style={{ backgroundColor: "#FFFFFF", padding: "104px 20px" }}
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5 md:col-start-1">
          <p
            className="mb-5 text-[12px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#87674F" }}
          >
            — Since 1974
          </p>
          <h2
            className="font-serif"
            style={{
              color: "#4F2607",
              fontSize: "clamp(32px, 4vw, 44px)",
              lineHeight: 1.15,
              fontWeight: 400,
            }}
          >
            A house built on patience,
            <br />
            and the slow turning of seasons.
          </h2>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <div className="space-y-5">
            <p
              style={{
                color: "#4F2607",
                fontSize: 16,
                lineHeight: "26px",
              }}
            >
              What began as a single workshop on the edge of the Kafue has
              grown into a quiet network of ateliers across Zambia, Zimbabwe
              and northern Tanzania. We have never been in a hurry. The wood
              dictates the tempo; the hand decides the line.
            </p>
            <p
              style={{
                color: "#585E6A",
                fontSize: 16,
                lineHeight: "26px",
              }}
            >
              Every piece we release has been lived with, sat upon, and slept
              beside by the people who made it. If it does not earn its place
              in a home we would want to return to, it does not leave the
              workshop.
            </p>

            <div className="flex flex-wrap gap-10 pt-6 border-t border-[#E5E7EB]">
              <Stat value="50" label="Years in practice" />
              <Stat value="27" label="Partner ateliers" />
              <Stat value="9" label="Wood species" />
            </div>

            <button
              className="mt-4 inline-flex items-center gap-2 transition-colors"
              style={{
                color: "#4F2607",
                fontSize: 16,
                lineHeight: "24px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#87674F")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#4F2607")
              }
            >
              Read the full story
              <IconArrow />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="font-serif"
        style={{
          color: "#4F2607",
          fontSize: 36,
          lineHeight: "43.2px",
          fontWeight: 400,
        }}
      >
        {value}
      </div>
      <div
        className="mt-1"
        style={{
          color: "#585E6A",
          fontSize: 12,
          fontWeight: 600,
          lineHeight: "24px",
          letterSpacing: 0,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ------------------------------- Collection ------------------------------- */

function Collection() {
  return (
    <section
      id="collection"
      style={{ backgroundColor: "#F2F3F5", padding: "104px 20px" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p
              className="mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#87674F" }}
            >
              — The Collection
            </p>
            <h2
              className="font-serif max-w-[22ch]"
              style={{
                color: "#4F2607",
                fontSize: "clamp(32px, 4vw, 44px)",
                lineHeight: 1.15,
                fontWeight: 400,
              }}
            >
              Pieces for a long, unhurried life.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["All", "Dining", "Living", "Bedroom", "Lighting"].map((t, i) => (
              <button
                key={t}
                className="transition-colors"
                style={{
                  backgroundColor: i === 0 ? "#4F2607" : "#FFFFFF",
                  color: i === 0 ? "#FFFFFF" : "#4F2607",
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: "24px",
                  padding: "6px 14px",
                  border: "1px solid #D2D5DB",
                  borderRadius: 0,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.name} product={p} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center transition-all"
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: 20,
              lineHeight: "32px",
              padding: "10px 30px 6px 30px",
              height: 52,
              minWidth: 280,
              backgroundColor: "rgba(79, 38, 7, 1)",
              color: "#FFFFFF",
              border: "2px solid #4F2607",
              borderRadius: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(79, 38, 7, 0.85)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(79, 38, 7, 1)")
            }
          >
            View all 124 pieces
          </a>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
}: {
  product: (typeof PRODUCTS)[number];
}) {
  const [hover, setHover] = useState(false);
  return (
    <article
      className="group flex flex-col bg-white transition-all duration-300"
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: 0,
        padding: 20,
        boxShadow: hover
          ? "0px 10px 20px 0px rgba(0,0,0,0.19), 0px 6px 6px 0px rgba(0,0,0,0.23)"
          : "6.5px 11.3px 19px 0px rgba(0,0,0,0.11)",
        backgroundColor: hover ? "#F2F3F5" : "#FFFFFF",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#F2F3F5]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span
          className="absolute top-3 left-3"
          style={{
            backgroundColor: "#F2F3F5",
            color: "#4F2607",
            fontSize: 12,
            fontWeight: 600,
            lineHeight: "24px",
            padding: "6px 12px",
            border: "1px solid #D2D5DB",
            borderRadius: 0,
          }}
        >
          {product.tag}
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <div
            style={{
              color: "#87674F",
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "24px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {product.category}
          </div>
          <h3
            className="font-serif mt-1"
            style={{
              color: "#4F2607",
              fontSize: 24,
              lineHeight: "30px",
              fontWeight: 400,
            }}
          >
            {product.name}
          </h3>
        </div>
        <div
          style={{
            color: "#4F2607",
            fontSize: 15,
            lineHeight: "24px",
            whiteSpace: "nowrap",
          }}
        >
          {product.price}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#EEEEEE] pt-4">
        <span
          style={{ color: "#585E6A", fontSize: 14, lineHeight: "24px" }}
        >
          Lead time: 10–14 weeks
        </span>
        <button
          className="flex items-center gap-2 transition-colors"
          style={{
            color: hover ? "#FF5A1F" : "#4F2607",
            fontSize: 14,
            lineHeight: "24px",
          }}
        >
          View
          <IconArrow />
        </button>
      </div>
    </article>
  );
}

/* ------------------------------- Craftsmanship ------------------------------- */

function Craftsmanship() {
  return (
    <section
      id="craftsmanship"
      className="relative w-full overflow-hidden"
      style={{ minHeight: 620 }}
    >
      <img
        src="/images/craftsmanship.jpg"
        alt="Artisan hands carving hardwood"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(17,35,55,0.78) 0%, rgba(17,35,55,0.55) 45%, rgba(79,38,7,0.35) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-[1200px] flex-col justify-center px-5 py-[104px] md:px-8">
        <div className="max-w-[560px]">
          <p
            className="mb-5 text-[12px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#FF5A1F" }}
          >
            — Craftsmanship
          </p>
          <h2
            className="font-serif text-white"
            style={{
              fontSize: "clamp(32px, 4.5vw, 48px)",
              lineHeight: 1.12,
              fontWeight: 400,
            }}
          >
            No nails. No shortcuts.
            <br />
            Only mortise, tenon, and time.
          </h2>
          <p
            className="mt-6 text-white/85"
            style={{ fontSize: 16, lineHeight: "26px", maxWidth: "48ch" }}
          >
            Every joint is cut by hand. Every surface finished with cold-pressed
            tung oil. We measure our work in decades, not delivery windows.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {[
              { k: "120h", v: "per dining table" },
              { k: "0", v: "power sanders used" },
              { k: "25yr", v: "structural guarantee" },
            ].map((s) => (
              <div key={s.k} className="border-l border-white/40 pl-4">
                <div
                  className="font-serif text-white"
                  style={{ fontSize: 32, lineHeight: "40px" }}
                >
                  {s.k}
                </div>
                <div
                  className="mt-1 text-white/75"
                  style={{ fontSize: 12, fontWeight: 600, lineHeight: "20px" }}
                >
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Quote Band ------------------------------- */

function Quote() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: "#FFFFFF", padding: "104px 20px" }}
    >
      <div className="mx-auto max-w-[920px] text-center">
        <p
          className="mb-8 text-[12px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "#87674F" }}
        >
          — In their words
        </p>
        <blockquote
          className="font-serif"
          style={{
            color: "#4F2607",
            fontSize: "clamp(26px, 3.4vw, 36px)",
            lineHeight: 1.3,
            fontWeight: 400,
          }}
        >
          “They delivered the dining table on a Tuesday in November. Twelve
          years on, the wood has darkened to the colour of strong tea, and I
          still run my hand along the edge every morning before the house
          wakes.”
        </blockquote>
        <div className="mt-10 flex items-center justify-center gap-4">
          <div
            className="h-[1px] w-10"
            style={{ backgroundColor: "#D2D5DB" }}
          />
          <div>
            <div
              style={{
                color: "#4F2607",
                fontSize: 14,
                lineHeight: "22px",
              }}
            >
              Isobel Mwangi
            </div>
            <div
              style={{
                color: "#585E6A",
                fontSize: 12,
                lineHeight: "20px",
              }}
            >
              Private client · Nairobi
            </div>
          </div>
          <div
            className="h-[1px] w-10"
            style={{ backgroundColor: "#D2D5DB" }}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Journal ------------------------------- */

function Journal() {
  return (
    <section
      id="journal"
      style={{ backgroundColor: "#F2F3F5", padding: "104px 20px" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p
              className="mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#87674F" }}
            >
              — The Journal
            </p>
            <h2
              className="font-serif"
              style={{
                color: "#4F2607",
                fontSize: "clamp(32px, 4vw, 44px)",
                lineHeight: 1.15,
                fontWeight: 400,
              }}
            >
              Notes from the workshop.
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 transition-colors hover:text-[#87674F]"
            style={{ color: "#4F2607", fontSize: 16, lineHeight: "24px" }}
          >
            All issues
            <IconArrow />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {JOURNAL.map((j) => (
            <article
              key={j.title}
              className="group border-t-2 border-[#4F2607] pt-6 cursor-pointer"
            >
              <div
                className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "#FF5A1F" }}
              >
                {j.date}
              </div>
              <h3
                className="font-serif transition-colors group-hover:text-[#87674F]"
                style={{
                  color: "#4F2607",
                  fontSize: 24,
                  lineHeight: "30px",
                  fontWeight: 400,
                }}
              >
                {j.title}
              </h3>
              <p
                className="mt-3"
                style={{ color: "#585E6A", fontSize: 15, lineHeight: "24px" }}
              >
                {j.excerpt}
              </p>
              <div
                className="mt-5 inline-flex items-center gap-2 transition-colors group-hover:text-[#FF5A1F]"
                style={{ color: "#4F2607", fontSize: 14, lineHeight: "22px" }}
              >
                Read the essay
                <IconArrow />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Newsletter / Contact ------------------------------- */

function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      setError(true);
      return;
    }
    setError(false);
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#112337", padding: "104px 20px" }}
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p
            className="mb-5 text-[12px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#FF5A1F" }}
          >
            — Correspondence
          </p>
          <h2
            className="font-serif text-white"
            style={{
              fontSize: "clamp(32px, 4vw, 44px)",
              lineHeight: 1.15,
              fontWeight: 400,
            }}
          >
            Letters from the workshop, four times a year.
          </h2>
          <p
            className="mt-5 text-white/75"
            style={{ fontSize: 16, lineHeight: "26px", maxWidth: "42ch" }}
          >
            New pieces, archival finds, and long-form essays. No promotions, no
            urgency, no noise.
          </p>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <form
            onSubmit={onSubmit}
            className="space-y-3"
            noValidate
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="First name"
                className="w-full outline-none transition-colors font-helvetica placeholder:text-[#686E77]/60"
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                  color: "#FFFFFF",
                  border: "2px solid rgba(255,255,255,0.55)",
                  borderRadius: 0,
                  padding: "10px 20px",
                  fontSize: 18,
                  lineHeight: "28.8px",
                  height: 52,
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "#204CE5")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)")
                }
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-full outline-none transition-colors font-helvetica placeholder:text-[#686E77]/60"
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                  color: "#FFFFFF",
                  border: "2px solid rgba(255,255,255,0.55)",
                  borderRadius: 0,
                  padding: "10px 20px",
                  fontSize: 18,
                  lineHeight: "28.8px",
                  height: 52,
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "#204CE5")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)")
                }
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="you@domain.com"
                className="w-full outline-none transition-colors font-helvetica placeholder:text-[#686E77]/60"
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                  color: error ? "#C02B0A" : "#FFFFFF",
                  border: `2px solid ${
                    error ? "#C02B0A" : "rgba(255,255,255,0.55)"
                  }`,
                  borderRadius: 0,
                  padding: "10px 20px",
                  fontSize: 18,
                  lineHeight: "28.8px",
                  height: 52,
                }}
                onFocus={(e) => {
                  if (!error) e.currentTarget.style.borderColor = "#204CE5";
                }}
                onBlur={(e) => {
                  if (!error)
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.55)";
                }}
              />
              {error && (
                <p
                  className="mt-2"
                  style={{ color: "#C02B0A", fontSize: 13 }}
                >
                  Please enter a valid email address.
                </p>
              )}
              {submitted && !error && (
                <p
                  className="mt-2 flex items-center gap-2"
                  style={{ color: "#399F4B", fontSize: 13 }}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#399F4B" }}
                  />
                  Thank you — your first letter is on its way.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
              <label
                className="flex items-center gap-3 cursor-pointer"
                style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}
              >
                <input type="checkbox" className="accent-[#FF5A1F] h-4 w-4" />
                I'd also like to receive commission invitations.
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center transition-all"
                style={{
                  fontFamily: "'Amiri', serif",
                  fontSize: 20,
                  lineHeight: "32px",
                  padding: "10px 30px 6px 30px",
                  height: 52,
                  minWidth: 200,
                  backgroundColor: "rgba(255, 90, 31, 0.9)",
                  color: "#FFFFFF",
                  border: "2px solid #FFFFFF",
                  borderRadius: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255, 90, 31, 1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255, 90, 31, 0.9)")
                }
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Footer ------------------------------- */

function Footer() {
  return (
    <footer
      id="atelier"
      style={{ backgroundColor: "#FFFFFF", padding: "72px 20px 32px" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div
              className="font-serif"
              style={{
                color: "#4F2607",
                fontSize: 22,
                lineHeight: "28px",
              }}
            >
              The African Touch
            </div>
            <p
              className="mt-4"
              style={{ color: "#585E6A", fontSize: 14, lineHeight: "22px" }}
            >
              Handcrafted hardwood furniture,
              <br />
              made slowly since 1974.
            </p>
          </div>

          {[
            {
              title: "Atelier",
              items: ["Our story", "Craftsmen", "Materials", "Sustainability"],
            },
            {
              title: "Collection",
              items: ["Dining", "Living", "Bedroom", "Lighting", "Bespoke"],
            },
            {
              title: "Service",
              items: [
                "Commissions",
                "Restoration",
                "Shipping & care",
                "Contact",
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div
                style={{
                  color: "#4F2607",
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: "24px",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                {col.title}
              </div>
              <ul className="mt-4 space-y-2">
                {col.items.map((i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="transition-colors hover:text-[#87674F]"
                      style={{
                        color: "#4F2607",
                        fontSize: 14,
                        lineHeight: "22px",
                      }}
                    >
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-16 flex flex-col gap-4 border-t border-[#E5E7EB] pt-6 md:flex-row md:items-center md:justify-between"
        >
          <div
            style={{ color: "#585E6A", fontSize: 13, lineHeight: "22px" }}
          >
            © 2026 The African Touch (Pty) Ltd. · Lusaka · Harare · Arusha
          </div>
          <div
            className="flex flex-wrap items-center gap-5"
            style={{ color: "#585E6A", fontSize: 13, lineHeight: "22px" }}
          >
            <a href="#" className="hover:text-[#4F2607]">
              Privacy
            </a>
            <a href="#" className="hover:text-[#4F2607]">
              Terms
            </a>
            <a href="#" className="hover:text-[#4F2607]">
              Instagram
            </a>
            <a href="#" className="hover:text-[#4F2607]">
              Pinterest
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------- App ------------------------------- */

export default function App() {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main>
        <Hero />
        <Heritage />
        <Collection />
        <Craftsmanship />
        <Quote />
        <Journal />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
