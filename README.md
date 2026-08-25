# Mukango Wa Africa — Canonical Production Storefront

> Heirloom handcrafted African hardwood furniture bridging Zambian artisanal mastery with contemporary architecture. Handcrafted from sustainable Zambezi Teak and Mukwa hardwoods in Lusaka, Zambia.

---

## 1. Overview

This repository contains the canonical production storefront for **Mukango Wa Africa**, located at `storefront/`.

### Key Features
- **Authoritative South African Rand (ZAR) Pricing & Multi-Currency Engine:** Authoritative pricing defaults to ZAR across cart calculation, Pro-Forma invoices, and regional gateways (PayFast), with seamless conversion and display in USD, EUR, GBP, and ZMW.
- **Curated Catalogue & Collections:** Complete suite of hand-carved dining tables, sovereign throned armchairs, credenzas, canopy beds, accent luminaires, and carved relief panels.
- **Narrative Design Motifs:** The Savannah Collection, Village Stories, Big Five Icons, Traditional Royal Court, and Zambezi River Flow.
- **Indigenous Timber Registry:** Detailed botanical profiles, hardness ratings, and finishing specifications for Zambezi Teak (*Baikiaea plurijuga*), Mukwa/Kiaat (*Pterocarpus angolensis*), and African Blackwood (*Dalbergia melanoxylon*).
- **Server-Authoritative Commerce Boundaries:** Typed boundaries for cart validation, pricing calculations, crated freight estimation, order persistence, and checkout.
- **Strict Payment Provider Boundaries (No Fake Commerce):** Live integration support for PayFast (South Africa Instant EFT / Card with ITN signature verification), Stripe (international card payments with HMAC-SHA256 webhooks), and SWIFT Bank Wire Pro-Forma Invoices.
- **Durable Order & Webhook Store:** PostgreSQL adapter for durable order persistence (`total_amount`, `currency`, `status`, `timeline`) and webhook idempotency tracking with fail-closed security when unconfigured.
- **Transactional Email Delivery:** Resend API integration with responsive, branded HTML templates for official Pro-Forma order confirmations, bespoke commission proposals, and customer inquiries.
- **Bespoke Commissions & Atelier Customization:** Full interactive customizer, room dimension specifications, and direct consultation scheduling with Founder & Master Craftsman Chiwama Kennedy Daka.
- **25-Year Heirloom Warranty & Phytosanitary Export:** Detailed global logistics protocols with ISPM-15 certified wooden crating.
- **Search Engine Optimization:** Dynamic OpenGraph metadata, Twitter cards, Product JSON-LD (with authoritative ZAR pricing), Breadcrumb JSON-LD, Organization JSON-LD, `robots.txt`, and authoritative `sitemap.xml` strictly excluding private cart/checkout routes.
- **Security:** Strict CSP headers, CORS origin allowlist applied to all endpoints & preflight requests, HMAC/MD5 webhook signatures, input sanitization, rate limiting, and honeypot spam protection.

---

## 2. Directory Structure

```
.
├── storefront/                  # Canonical customer-facing production application
│   ├── netlify/
│   │   └── functions/           # Netlify serverless function entry points (api.ts)
│   ├── public/                  # Static assets (favicons, robots.txt, images, headers, redirects)
│   ├── scripts/                 # Build scripts (sitemap generator)
│   ├── src/
│   │   ├── components/          # Reusable UI components (layout, shop, cart, bespoke, home)
│   │   ├── context/             # CartContext and ToastContext providers
│   │   ├── data/                # Authoritative products, collections, timbers, motifs, journal
│   │   ├── pages/               # Route pages (Home, Shop, Detail, Bespoke, About, Checkout...)
│   │   ├── server/              # Server-side API router, cart validation, payment & order stores
│   │   ├── types/               # TypeScript data models for commerce, products, forms
│   │   └── utils/               # Sanitization, currency, SEO, and class merging
│   ├── tests/                   # Automated Vitest test suite (75 unit & end-to-end tests)
│   ├── netlify.toml             # Storefront-specific Netlify configuration
│   ├── package.json             # Locked storefront dependencies
│   ├── tsconfig.json            # TypeScript configuration
│   └── vite.config.ts           # Vite bundler & dev API server middleware
├── netlify.toml                 # Root deployment configuration
├── package.json                 # Root monorepo manifest & workspace runner
└── README.md                    # Project documentation
```

---

## 3. Getting Started

### Prerequisites
- Node.js >= 20.0.0 (Node 22 recommended)
- npm >= 10.0.0

### Local Installation & Development
```bash
# From the repository root (single root package-lock.json for the workspace)
npm ci

# Start the local development server (root script proxies to the storefront workspace)
npm run dev
```

`npm ci` also works from inside `storefront/` — npm resolves the workspace
root automatically and installs the same locked dependency tree.

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

## 4. Production Environment Configuration

Create `.env` in `storefront/` based on `storefront/.env.example`:

| Variable | Description | Example / Default |
|---|---|---|
| `SITE_URL` | Canonical production domain | `https://mukangoafrica.co.za` |
| `DEFAULT_CURRENCY` | Authoritative base currency code | `ZAR` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/mukango` |
| `PAYFAST_MERCHANT_ID` | PayFast live merchant ID | `10000100` (sandbox) or your live ID |
| `PAYFAST_MERCHANT_KEY` | PayFast merchant key | `46f0cd694581a` (sandbox) or your live key |
| `PAYFAST_PASSPHRASE` | PayFast security passphrase | `your_secret_passphrase` |
| `PAYFAST_SANDBOX` | PayFast sandbox environment toggle | `false` in production, `true` for staging |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` (or `sk_test_...`) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `BANK_NAME` | Beneficiary bank name for wire pro-forma invoices | Your verified corporate bank name |
| `BANK_ACCOUNT_NAME` | Corporate account name | Your verified corporate account name |
| `BANK_ACCOUNT_NUMBER` | Corporate bank account number | Your verified corporate account number |
| `BANK_SWIFT_CODE` | Corporate SWIFT/BIC routing code | Your verified SWIFT/BIC code |
| `RESEND_API_KEY` | API key for transactional emails | `re_...` |
| `SMTP_HOST` / `SMTP_USER` | Optional alternative SMTP transport (if Resend unused) | `smtp.example.com` |
| `CONTACT_RECEIVER_EMAIL` | Atelier recipient for inquiries | `enquiries@mukangoafrica.co.za` |
| `EMAIL_FROM` | Sender address for transactional emails | `Mukango Wa Africa <orders@mukangoafrica.co.za>` |
| `ALLOW_TEST_MEMORY_STORE` | Development/test only: permits in-memory order store fallback | `true` in local test runs, never in production |

---

## 5. Security & Deployment

- **Netlify Serverless Deployment:** Configured via `netlify.toml` with base directory `storefront/` and serverless functions at `netlify/functions/api.ts`.
- **Security Headers:** Content Security Policy, X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`), Strict-Transport-Security, and Referrer-Policy configured via `netlify.toml` and `public/_headers`.
- **Sitemap & Robots:** Private routes (`/cart`, `/checkout`, `/api/`) are excluded from `sitemap.xml` and disallowed in `robots.txt`.
