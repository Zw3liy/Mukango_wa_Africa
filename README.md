# Mukango Wa Africa — Canonical Production Storefront

> Heirloom handcrafted African hardwood furniture bridging Zambian artisanal mastery with contemporary design. Handcrafted from sustainable Zambezi Teak and Mukwa hardwoods in Lusaka, Zambia.

---

## 1. Overview

This repository contains the canonical production storefront for **Mukango Wa Africa**, located at `storefront/`.

### Key Features
- **Curated Catalogue & Collections:** Complete suite of hand-carved dining tables, sovereign throned armchairs, credenzas, canopy beds, accent luminaires, and carved relief panels.
- **Narrative Design Motifs:** The Savannah Collection, Village Stories, Big Five Icons, Traditional Royal Court, and Zambezi River Flow.
- **Indigenous Timber Registry:** Detailed botanical profiles, hardness ratings, and finishing specifications for Zambezi Teak (*Baikiaea plurijuga*), Mukwa/Kiaat (*Pterocarpus angolensis*), and African Blackwood (*Dalbergia melanoxylon*).
- **Server-Authoritative Commerce Boundaries:** Typed boundaries for cart validation, pricing calculations, crated freight estimation, order persistence, and checkout.
- **No Fake Commerce:** Strict payment provider abstraction (Stripe, PayFast, SWIFT Bank Wire) and email delivery provider (Resend) that fail safely and explicitly report missing credentials without fabricating orders or transactions.
- **Bespoke Commissions & Atelier Walkthroughs:** Full interactive customizer, room dimension specifications, and direct consultations with Founder & Master Craftsman Chiwama Kennedy Daka.
- **25-Year Heirloom Warranty & Phytosanitary Export:** Detailed global logistics protocols with ISPM-15 certified wooden crating.
- **Search Engine Optimization:** Dynamic OpenGraph metadata, Twitter cards, Product JSON-LD, Breadcrumb JSON-LD, Organization JSON-LD, `robots.txt`, and authoritative `sitemap.xml` strictly excluding private cart/checkout routes.
- **Security:** CSP headers, CORS origin verification, HMAC webhook signatures, input sanitization, rate limiting, and honeypot spam protection.

---

## 2. Directory Structure

```
.
├── storefront/                  # Canonical customer-facing production application
│   ├── public/                  # Static assets (favicons, robots.txt, images)
│   ├── scripts/                 # Build scripts (sitemap generator)
│   ├── src/
│   │   ├── components/          # Reusable UI components (layout, shop, cart, bespoke, home)
│   │   ├── context/             # CartContext and ToastContext providers
│   │   ├── data/                # Authoritative products, collections, timbers, motifs, journal
│   │   ├── pages/               # Route pages (Home, Shop, Detail, Bespoke, About, Checkout...)
│   │   ├── server/              # Server-side API router, cart validation, payment & order stores
│   │   ├── types/               # TypeScript data models for commerce, products, forms
│   │   └── utils/               # Sanitization, currency, SEO, and class merging
│   ├── tests/                   # Automated Vitest test suite
│   ├── netlify.toml             # Storefront-specific Netlify configuration
│   ├── package.json             # Locked storefront dependencies
│   ├── tsconfig.json            # TypeScript configuration
│   └── vite.config.ts           # Vite bundler & dev API server middleware
├── netlify.toml                 # Root deployment configuration
├── .github/workflows/ci.yml     # Automated GitHub Actions CI pipeline
└── README.md                    # Project documentation
```

---

## 3. Getting Started

### Prerequisites
- Node.js >= 20.0.0 (Node 22 recommended)
- npm >= 10.0.0

### Local Installation & Development
```bash
# Navigate to the storefront directory
cd storefront

# Install locked dependencies
npm ci

# Start the local development server
npm run dev
```

### Complete Validation Pipeline
```bash
# Run TypeScript, ESLint, and full automated test suite
npm run check

# Audit dependencies for high/critical security issues
npm audit --audit-level=high

# Build production bundle with sitemap generation
npm run build
```

---

## 4. Environment Variables

Create `.env` in `storefront/` (see `storefront/.env.example`):

| Variable | Description |
|---|---|
| `SITE_URL` | Canonical production domain (e.g. `https://mukangowaafrica.com`) |
| `STRIPE_SECRET_KEY` | Stripe secret key for live card checkout (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `PAYFAST_MERCHANT_ID` | PayFast Merchant ID for South African EFT/cards |
| `PAYFAST_MERCHANT_KEY` | PayFast Merchant Key |
| `PAYFAST_PASSPHRASE` | PayFast Security Passphrase |
| `RESEND_API_KEY` | API Key for transactional email delivery |
| `CONTACT_RECEIVER_EMAIL` | Recipient email address for contact and bespoke requests |
| `DATABASE_URL` | PostgreSQL / durable database connection string |

---

## 5. Security & Deployment

- **Headers:** Content Security Policy, X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`), Strict-Transport-Security, and Referrer-Policy configured via `netlify.toml` and `public/_headers`.
- **Sitemap & Robots:** Private routes (`/cart`, `/checkout`, `/api/`) are excluded from `sitemap.xml` and disallowed in `robots.txt`.
