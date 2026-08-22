# Mukango Wa Africa — Repository Report

**Inspection date:** 22 August 2026  
**Repository:** `Zw3liy/Mukango_wa_Africa`  
**Inspected commit:** `a2b217e3caa6a68b16310fd782ccb081acac5f98` (`main` baseline)  
**Working branch:** `arena/01a02aeb-mukango-wa-africa`

> This is a point-in-time report of the repository before this report was added. Generated dependency/build folders were removed after validation and are not included in the inventory.

## 1. Executive summary

This repository is a small, frontend-only concept repository for an African handcrafted-furniture brand. It contains **two separate website prototypes**:

1. **A standalone HTML/JavaScript prototype** at the repository root, branded **“Mukango Wa Africa.”** It uses the Tailwind CDN, Google Fonts, remote placeholder images, hard-coded product/content data, and vanilla JavaScript.
2. **A Vite + React + TypeScript + Tailwind CSS application** under `african-touch-design-system/`, branded **“The African Touch.”** It is a polished, responsive landing/catalog page with local hero images, six remote product images, and mock interactions.

It also contains:

- A ZIP archive that is an **exact duplicate** of the React project source.
- A `.claude/skills/senior-fullstack/` toolkit whose documentation and Python scripts are mostly generic placeholders and are not used by the website.
- A stray, effectively empty root-level `package-lock.json`.

The repository is a **design prototype, not a production commerce application**. There is no backend, database, API, authentication, CMS, order processing, payment integration, persistent cart, functional search, product-detail routing, or real form delivery.

The React application installs, type-checks, and builds successfully. Its current dependency tree reports **three known vulnerabilities: two high and one low**. There are no automated tests, linter, formatter, CI workflow, deployment configuration, README, license, or `.gitignore`.

## 2. Repository identity and history

### Git/GitHub metadata

| Item | Value |
|---|---|
| GitHub URL | `https://github.com/Zw3liy/Mukango_wa_Africa` |
| Visibility | Public |
| GitHub description | `WEbsite` |
| Default branch | `main` |
| Repository created | 5 August 2026, 08:41 UTC |
| Baseline commit | `a2b217e3caa6a68b16310fd782ccb081acac5f98` |
| Baseline commit subject | `Initial commit with project files` |
| Commit author | Forest Valentine `<forestv96@icloud.com>` |
| Commit date | 5 August 2026, 10:44:09 +02:00 |
| Commit count visible in checkout | 1 |
| Tags/releases | None |
| Forks/stars | 0 / 0 at inspection time |
| GitHub license metadata | None |
| GitHub primary language | HTML |

All 21 baseline files use regular mode `100644`; the Python files have shebangs but are not marked executable.

### Naming inconsistencies

The repository has four different identities:

- Repository: **Mukango_wa_Africa**
- Standalone prototype: **Mukango Wa Africa**
- React prototype: **The African Touch**
- Root lockfile package name: **Mokhango** (different spelling)

The React package itself has the generic name `react-vite-tailwind`. A production project should select one canonical brand and package identity.

## 3. Size and composition

### Baseline totals

- **21 tracked files**
- **1,616,090 tracked bytes** (about 1.54 MiB)
- Working checkout before dependency installation: about **2.4 MiB**, including `.git`
- Git pack size: about **688.55 KiB**
- Largest item: `african-touch-design-system.zip` at **777,531 bytes**

### Files by extension

| Extension | Files | Text lines where applicable |
|---|---:|---:|
| Markdown | 4 | 518 |
| JSON | 4 | 2,646 |
| Python | 3 | 342 |
| TSX | 2 | 1,226 |
| TypeScript | 2 | 25 |
| HTML | 2 | 808 |
| JPEG | 2 | Binary |
| CSS | 1 | 84 |
| ZIP | 1 | Binary |

Most JSON lines come from the npm lockfile. Most application logic is concentrated in the 1,216-line `src/App.tsx` and 790-line standalone HTML file.

## 4. Directory structure

```text
.
├── .claude/
│   └── skills/senior-fullstack/
│       ├── SKILL.md
│       ├── references/
│       │   ├── architecture_patterns.md
│       │   ├── development_workflows.md
│       │   └── tech_stack_guide.md
│       └── scripts/
│           ├── code_quality_analyzer.py
│           ├── fullstack_scaffolder.py
│           └── project_scaffolder.py
├── 40bba4c4-f960-4250-a2bf-8c0528fc4b62.html
├── african-touch-design-system.zip
├── african-touch-design-system/
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public/images/
│   │   ├── craftsmanship.jpg
│   │   └── hero.jpg
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── utils/cn.ts
│   ├── tsconfig.json
│   └── vite.config.ts
└── package-lock.json
```

There is no root application manifest, monorepo/workspace configuration, or script tying the root artifacts together.

## 5. Complete file inventory

| Path | Bytes | Lines | Purpose |
|---|---:|---:|---|
| `.claude/skills/senior-fullstack/SKILL.md` | 4,495 | 209 | Generic “senior fullstack” skill description and advertised workflows. |
| `.claude/skills/senior-fullstack/references/architecture_patterns.md` | 1,618 | 103 | Placeholder reference with generic pattern headings and sample code. |
| `.claude/skills/senior-fullstack/references/development_workflows.md` | 1,618 | 103 | Placeholder reference; structurally almost identical to the other references. |
| `.claude/skills/senior-fullstack/references/tech_stack_guide.md` | 1,613 | 103 | Placeholder reference; also repeats the same generic content. |
| `.claude/skills/senior-fullstack/scripts/code_quality_analyzer.py` | 3,154 | 114 | CLI shell that validates a path and always returns success with zero findings. |
| `.claude/skills/senior-fullstack/scripts/fullstack_scaffolder.py` | 3,151 | 114 | Near-identical CLI shell; does not scaffold files. |
| `.claude/skills/senior-fullstack/scripts/project_scaffolder.py` | 3,141 | 114 | Near-identical CLI shell; does not analyze or scaffold a project. |
| `40bba4c4-f960-4250-a2bf-8c0528fc4b62.html` | 43,723 | 790 | Complete standalone Mukango Wa Africa concept page. |
| `african-touch-design-system.zip` | 777,531 | — | Byte-for-byte source snapshot of the React project directory contents. |
| `african-touch-design-system/index.html` | 648 | 18 | Vite entry document, Google Font links, title, and React mount node. |
| `african-touch-design-system/package-lock.json` | 85,633 | 2,581 | npm lockfile v3 with 164 dependency package entries. |
| `african-touch-design-system/package.json` | 629 | 28 | React/Vite project manifest and three scripts. |
| `african-touch-design-system/public/images/craftsmanship.jpg` | 275,924 | — | 1536×1024 JPEG showing hands carving wood with a hand tool. |
| `african-touch-design-system/public/images/hero.jpg` | 372,221 | — | 1536×1024 JPEG of a warm safari-lodge interior at sunset. |
| `african-touch-design-system/src/App.tsx` | 37,445 | 1,216 | All React page data, icons, components, content, styling, and interaction logic. |
| `african-touch-design-system/src/index.css` | 1,841 | 84 | Tailwind import, theme tokens, body defaults, and hero animations. |
| `african-touch-design-system/src/main.tsx` | 230 | 10 | React 19 root setup under `StrictMode`. |
| `african-touch-design-system/src/utils/cn.ts` | 169 | 6 | `clsx` + `tailwind-merge` helper; currently unused. |
| `african-touch-design-system/tsconfig.json` | 681 | 31 | Strict TypeScript/bundler configuration and `@/*` path mapping. |
| `african-touch-design-system/vite.config.ts` | 538 | 19 | React, Tailwind, and single-file Vite plugins plus `@` alias. |
| `package-lock.json` | 87 | 6 | Empty root lockfile named `Mokhango`; no packages or matching root `package.json`. |

### Archive duplication

The ZIP has 15 archive entries, including directory entries, and 775,959 uncompressed bytes. After extraction, every file checksum matches the corresponding file in `african-touch-design-system/`. The archive therefore adds no unique source or assets and nearly doubles the tracked payload.

ZIP SHA-256:

```text
4e91a1365ddc9251d65a4bbf9a06a1e9f8fe85f5a525e7cde2ee445999daf605
```

## 6. Standalone HTML prototype

### Location and technology

`40bba4c4-f960-4250-a2bf-8c0528fc4b62.html` is a self-contained source document, but not fully offline:

- Plain HTML, embedded CSS, and embedded JavaScript
- Tailwind loaded at runtime from `https://cdn.tailwindcss.com`
- Cormorant Garamond and Inter loaded from Google Fonts
- Product and editorial images loaded from `picsum.photos`
- No package manager, compilation, framework, or local assets

### Brand and visual direction

The page is branded **Mukango Wa Africa** and describes a Lusaka-based studio combining Zambian carving traditions with Scandinavian/contemporary minimalism.

Its custom palette defines:

- Cream `#faf9f6`
- Warm white `#f7f5f0`
- Light oak `#d4b896`
- Rich teak `#8b6f47`
- Deep charcoal `#2d2a26`

It uses Cormorant Garamond for display/serif typography and Inter for body copy. Cards use subtle lift, image scale, brightness, and overlay transitions.

### Page sections

1. Sticky desktop/mobile header with brand, generated navigation, search icon, and bag count.
2. Hero: “Where Heritage Meets Modern Living,” with collection and bespoke calls to action.
3. Filterable product collection.
4. Three design-motif cards.
5. About section focused on founder/master craftsman Chiwama Kennedy Daka.
6. Three-step bespoke commission process.
7. Three client testimonials.
8. Three journal posts.
9. Newsletter signup.
10. Showroom/contact details and enquiry form.
11. Four-column footer with generated links and social icons.

### Hard-coded catalog data

The script contains 12 products:

| Product | Category | Price | Motif |
|---|---|---:|---|
| The Savannah Throned Chair | chair | $1,850.00 | Savannah |
| Village Stories Dining Table | table | $3,200.00 | Village |
| Cheetah Ottoman | accent | $680.00 | Savannah |
| Heritage Carved Lamp | lighting | $420.00 | Village |
| Big Five Console Table | table | $2,400.00 | Big Five |
| Nkosi Armchair | chair | $1,450.00 | Traditional |
| River Valley Side Table | accent | $890.00 | Savannah |
| Village Stories Wall Art | accent | $350.00 | Village |
| Moonlight Pendant Lamp | lighting | $560.00 | Traditional |
| Ubuntu Lounge Chair | chair | $1,980.00 | Savannah |
| Zambezi Coffee Table | table | $1,250.00 | Big Five |
| Sunset Stool Set | accent | $720.00 | Village |

The catalog filters are All, Chairs, Tables, Accents, and Lighting. Filtering works by replacing the product-grid HTML with matching hard-coded records.

The data layer also includes:

- Three motifs: Savannah Collection, Village Stories, and Big Five Icons
- Stats claiming 20+ years, 500+ pieces, and 15 countries served
- Three commission steps
- Three testimonials
- Three 2025 blog posts
- Footer link and social-link datasets
- A showroom address, phone number, email address, and operating hours

These business claims and contact details appear to be prototype content and should be verified before publication.

### Implemented behavior

- Smooth in-page navigation through delegated click handling
- Mobile menu open/close
- Product category filtering
- Product-card click alerts with the product name and description
- Newsletter form reset plus confirmation alert
- Contact form reset plus confirmation alert
- Hover overlays and transitions

### Gaps and defects

- Search and bag buttons have no behavior.
- Product cards show an `alert()` instead of navigation or a product dialog.
- Newsletter and contact forms do not transmit or persist data.
- Contact fields have `id` attributes but no `name` attributes. `new FormData(form).get("name")` therefore returns `null`, so the success alert begins with **“Thank you null!”**.
- Each product has an unused `detail` image URL; 12 of the 32 Picsum URLs embedded in the file are never rendered.
- The empty `#mobile-overlay` element has no implementation.
- The desktop navigation renderer inserts `<li>` elements directly inside a `<div>`, which is invalid list semantics.
- Product cards are click targets without a button/link role, keyboard focus, or keyboard activation.
- The mobile menu button does not expose `aria-expanded` or `aria-controls`, and its “Open menu” label is not updated while open.
- Several custom Tailwind-looking class names—such as `text-deep-charcoal`, `text-light-oak`, `border-deep-charcoal`, `bg-deep-charcoal`, and `from-deep-charcoal/80`—are not defined in the custom CSS or a Tailwind configuration. Some backgrounds have inline fallbacks, but other intended colors/gradients may not apply.
- `innerHTML` rendering is safe only while all data remains trusted and hard-coded; directly substituting external/user content would create an XSS risk.
- Tailwind’s CDN build is intended for development/prototyping rather than optimized production delivery.
- The page requires multiple third-party services at runtime and has no Content Security Policy or Subresource Integrity metadata.

## 7. React/Vite prototype

### Location and technology stack

The main buildable project is `african-touch-design-system/`.

#### Runtime dependencies

| Package | Pinned version | Role |
|---|---:|---|
| `react` | 19.2.6 | Component/runtime layer |
| `react-dom` | 19.2.6 | Browser renderer |
| `clsx` | 2.1.1 | Conditional class composition; only referenced by unused `cn.ts` |
| `tailwind-merge` | 3.4.0 | Tailwind class deduplication; only referenced by unused `cn.ts` |

#### Development dependencies

| Package | Pinned version | Role |
|---|---:|---|
| `vite` | 7.3.2 | Dev server and build tool |
| `typescript` | 5.9.3 | Static type checking |
| `tailwindcss` | 4.1.17 | Utility CSS engine |
| `@tailwindcss/vite` | 4.1.17 | Tailwind Vite integration |
| `@vitejs/plugin-react` | 5.1.1 | React transform/Fast Refresh |
| `vite-plugin-singlefile` | 2.3.0 | Inlines built JS and CSS into `index.html` |
| `@types/node` | 22.19.17 | Node types for config/build code |
| `@types/react` | 19.2.7 | React TypeScript types |
| `@types/react-dom` | 19.2.3 | React DOM TypeScript types |

The lockfile is npm lockfile version 3. It contains 164 dependency package entries: 5 production-side entries and 159 development entries by the lockfile flags. `npm audit` counts 164 total dependencies plus optional relationships.

### Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

There are no `test`, `lint`, `format`, or explicit `typecheck` scripts.

### Build configuration

`vite.config.ts` enables:

1. React plugin
2. Tailwind CSS Vite plugin
3. `vite-plugin-singlefile`
4. `@` alias to `src/`

The alias is mirrored in `tsconfig.json` but is not used by the current imports.

Despite the single-file plugin name, only JavaScript and CSS are inlined. Files under `public/images/` remain separate build artifacts and must be deployed with `dist/index.html`.

TypeScript targets ES2020, uses bundler module resolution and React JSX, performs no emit, and enables strictness plus unused-local, unused-parameter, and fallthrough checks.

### Entry and global styling

`src/main.tsx` mounts `<App />` into `#root` inside React `StrictMode`.

`src/index.css`:

- Imports Tailwind CSS 4.
- Defines theme colors for safari brown, navy, terracotta, taupe, cobalt/ocean interaction colors, neutrals, and success/warning/error states.
- Defines Amiri, Montserrat, and Helvetica font stacks.
- Defines three shadow tokens.
- Enables smooth scrolling.
- Sets body color, background, typography, and font smoothing.
- Adds three staggered `fadeUp` hero animation classes.

Google Fonts are linked from `index.html`, making Amiri and Montserrat network dependencies.

### Application structure

All application components and datasets live in `src/App.tsx`:

| Component/data | Responsibility |
|---|---|
| `NAV` | Six anchor destinations: Collection, Heritage, Craftsmanship, Journal, Atelier, Contact |
| `PRODUCTS` | Six catalog cards with Pexels images, category, price, and badge |
| `JOURNAL` | Three issue summaries |
| `IconMenu`, `IconClose`, `IconArrow` | Inline SVG icons |
| `Header` | Fixed responsive navigation, scroll shadow, mobile drawer |
| `Hero` | Local hero image, collection message, calls to action, caption bar |
| `Heritage` | Brand story, two paragraphs, three statistics, story button |
| `Stat` | Reusable statistic display |
| `Collection` | Category buttons, six product cards, all-pieces CTA |
| `ProductCard` | Image, badge, category/name/price, lead time, hover treatment |
| `Craftsmanship` | Local carving image, process message, three craft statistics |
| `Quote` | Testimonial band |
| `Journal` | Three article summaries |
| `Newsletter` | Name/email form with local validation and success/error UI |
| `Footer` | Brand statement, three link columns, locations/legal/social links |
| `App` | Composes the complete single page |

### React page content

The page is branded **The African Touch**, “Est. 1974,” with copy describing a network of ateliers across Zambia, Zimbabwe, and northern Tanzania.

The six hard-coded products are:

| Product | Category | Price | Badge |
|---|---|---:|---|
| Serengeti Dining Table | Dining | From $4,800 | Signature |
| Mara Carver Chair | Seating | From $1,250 | Hand-Carved |
| Okavango Four-Poster | Bedroom | From $7,400 | Limited |
| Baobab Credenza | Storage | From $3,600 | New Season |
| Zambezi Low Table | Living | From $1,900 | Signature |
| Kilimanjaro Lamp | Lighting | From $680 | Artisan |

Other claims include 50 years in practice, 27 partner ateliers, nine wood species, 120 hours per dining table, zero power sanders, a 25-year structural guarantee, 124 total pieces, 10–14 week lead times, and offices/locations in Lusaka, Harare, and Arusha. These should be treated as unverified prototype copy.

### Implemented behavior

- Header changes appearance after scrolling more than 24 pixels.
- Mobile navigation drawer opens, closes, and closes when a nav link is chosen.
- Hero buttons scroll to sections.
- Product cards animate and change shadow/background/CTA color on pointer hover.
- Newsletter email is checked with a basic regular expression.
- Invalid and successful newsletter states are displayed in the page.
- Layout is responsive through Tailwind breakpoints.

### Unimplemented or mock behavior

- Category buttons do not filter the product list; “All” is permanently styled as selected.
- Search, Bag, “Read the full story,” product View buttons, “View all 124 pieces,” journal links, and almost every footer link are placeholders.
- Many anchors use `href="#"`, which moves the page to the top rather than opening content.
- There is no product detail page, route, modal, or cart.
- The newsletter never sends data to a service. First/last names and the commission-invitations checkbox are not read, validated, or persisted.
- Success copy says the first letter “is on its way” even though no request occurs.
- `src/utils/cn.ts` is unused, making `clsx` and `tailwind-merge` unnecessary in the current runtime bundle/source design.

### Accessibility observations

Positive points include semantic page sections, useful local-image alt text, native buttons/anchors for most controls, and hidden decorative SVGs.

Areas needing work:

- Newsletter inputs use placeholders instead of associated labels.
- Newsletter status messages do not use an `aria-live` region.
- Mobile menu lacks `aria-expanded` and `aria-controls`.
- The collapsed drawer is hidden with max-height and opacity; its links can remain in the tab order while visually closed.
- Product/category state does not expose selected semantics such as `aria-pressed`.
- Several visible interactions are pointer-hover-only with no comparable focus styling.
- Hero animation has no `prefers-reduced-motion` fallback.
- Placeholder links and controls create misleading keyboard/navigation behavior.

### SEO and metadata

The Vite HTML has a descriptive title and language/viewport declarations, but it has no:

- Meta description
- Canonical URL
- Open Graph/Twitter metadata
- Structured data
- Favicon/manifest
- `robots.txt` or sitemap

The standalone HTML has a meta description but likewise lacks the rest of this production metadata.

## 8. Assets and external services

### Local images

| File | Dimensions | Size | SHA-256 |
|---|---:|---:|---|
| `hero.jpg` | 1536×1024 | 372,221 bytes | `eba9881516b07fa80cd3d6ec6c5908add2f50913ff7b72ee982e7e8543983536` |
| `craftsmanship.jpg` | 1536×1024 | 275,924 bytes | `5e282bb952f78fef20fe77211a6ca6a65aa4001267de4873a3dda9b1e26aa0f6` |

Together they add 648,145 bytes. There are no alternate WebP/AVIF sizes or responsive `srcset` variants.

### External runtime domains

The applications rely on:

- `cdn.tailwindcss.com` — standalone prototype CSS runtime
- `fonts.googleapis.com` and `fonts.gstatic.com` — both prototypes’ fonts
- `picsum.photos` — standalone prototype imagery
- `images.pexels.com` — React product imagery

The React product images are all rendered without `loading="lazy"`; local and below-the-fold images are also eager by default. This can increase initial network and decode work. The standalone prototype marks most non-hero imagery lazy.

No asset licensing, attribution file, or provenance document is present for either local or remote imagery.

## 9. `.claude` skill/tooling contents

The `.claude/skills/senior-fullstack/` folder is development-agent metadata and has no runtime connection to either website.

### Documentation quality

`SKILL.md` advertises fullstack/project scaffolding and code-quality analysis across React, Next.js, Node.js, GraphQL, PostgreSQL, cloud, DevOps, and mobile stacks. The three reference guides, however, are generic templates containing placeholders such as “Scenario 1,” “Benefit 1,” “Tool 1,” and “Implementation details.” The references repeat essentially the same structure rather than supplying architecture-, workflow-, or stack-specific guidance.

Some documented commands do not match the scripts:

- Scripts require a positional target, although quick-start examples imply options-only use.
- `code_quality_analyzer.py --analyze` is documented, but no `--analyze` option exists.
- The skill advertises test/lint/deployment commands that this repository does not configure.

### Python scripts

The three scripts differ primarily in class/program names. Each:

1. Accepts a required target path.
2. Accepts `--verbose`, `--json`, and `--output`.
3. Verifies that the target exists.
4. Sets `status` to `success`.
5. Sets `findings` to an empty list.
6. Prints a report.

They do not inspect source, calculate metrics, identify quality issues, generate a scaffold, modify files, or perform automated fixes. `--output` only has an effect when `--json` is also supplied. Imports such as `os`, `List`, and `Optional` are unused.

All scripts compile and run, but successful output only confirms that the target path exists.

## 10. Validation results

The following checks were performed against the untouched baseline application.

### React project

| Check | Result |
|---|---|
| `npm ci` | Passed; 96 packages installed in the test environment |
| `npm run build` | Passed with Vite 7.3.2; 29 modules transformed |
| `npx tsc --noEmit` | Passed with no type errors |
| `npm audit` | Failed policy status: 3 vulnerabilities (2 high, 1 low) |
| Automated tests | None present |
| Lint | Not configured |
| Formatting check | Not configured |

Production build output observed:

| Build artifact | Approximate size |
|---|---:|
| `dist/index.html` | 236.02 kB; 71.04 kB gzip |
| `dist/images/hero.jpg` | 372,221 bytes |
| `dist/images/craftsmanship.jpg` | 275,924 bytes |

The build generated successfully and temporary `node_modules/`, `dist/`, and Python bytecode were removed after inspection.

### Python tooling

- All three files passed `python3 -m py_compile`.
- All three accepted the React project as a target and returned success with zero findings.
- The smoke tests confirmed the tools’ no-op behavior; they did not validate website quality.

### ZIP comparison

- Extracted archive contents matched the React project source exactly.
- No unique archived content was found.

## 11. Dependency/security findings

`npm audit` on 22 August 2026 reported:

| Package | Direct? | Severity | Finding | Current affected version/path | Fix availability |
|---|---|---|---|---|---|
| `vite` | Yes, dev | High aggregate | Windows `server.fs.deny` path bypass; Windows launch-editor UNC/NTLM issue | 7.3.2 | Upgrade to 7.3.6 reported as non-major fix |
| `nanoid` | Transitive dev | High | Custom generators can loop indefinitely with size zero | 3.3.17 through PostCSS/Vite | Fix available |
| `esbuild` | Transitive dev | Low | Arbitrary file-read issue in Windows dev-server scenario | 0.27.7 through Vite | Fix available |

These are build/development-chain findings rather than vulnerabilities in a server-side production runtime, because the delivered site is static. They still matter for contributors and CI, especially on Windows, and should be remediated and re-audited.

Additional security/privacy observations:

- No environment files, credential files, authentication code, or obvious secrets were found.
- There is no backend handling sensitive data.
- The forms currently collect data only in the browser and do not transmit it, despite success messages implying delivery.
- The standalone page loads executable JavaScript from a third-party CDN without SRI and has no CSP.
- Remote images and fonts expose visitor requests to third parties.
- Hard-coded `innerHTML` is currently controlled, but the rendering approach requires sanitization if connected to dynamic content.

## 12. Project hygiene and operational maturity

The repository does **not** contain:

- `README.md`
- `LICENSE` or license metadata
- `.gitignore`
- `.editorconfig`
- Node-version declaration such as `.nvmrc` or `.node-version`
- Contribution or security policy
- Changelog
- Environment example/configuration
- ESLint configuration
- Prettier configuration
- Unit, component, end-to-end, or accessibility tests
- GitHub Actions or other CI configuration
- Docker/container files
- Hosting/deployment configuration
- Monitoring or analytics integration
- Dependency-update automation

Because `.gitignore` is absent, normal `npm ci` and `npm run build` usage creates untracked `node_modules/` and `dist/` entries locally.

## 13. Architecture and production-readiness assessment

### Current architecture

```text
Browser
├── Standalone HTML prototype
│   ├── Embedded static content/data
│   ├── Embedded vanilla-JS render/event layer
│   └── Tailwind CDN + Google Fonts + Picsum
└── React prototype
    ├── Vite-generated static HTML/JS/CSS
    ├── One monolithic App.tsx
    ├── Hard-coded in-memory catalog/editorial data
    ├── Two local JPEG assets
    └── Google Fonts + Pexels product images
```

There is no application/server boundary. Nothing is persisted between page loads.

### Strengths

- Both prototypes communicate a coherent premium craft/furniture visual direction.
- The React page is responsive and componentized at the function level.
- TypeScript strict mode is enabled and currently passes.
- The React production build is successful.
- Navigation targets in the React version correspond to real page sections.
- Local hero/craft images have useful alt text.
- Lockfile pins the dependency graph for reproducible installation.
- The standalone version demonstrates working client-side filtering.

### Main limitations

1. **No canonical product:** two substantially different prototypes, brands, datasets, visual systems, and dates coexist without explanation.
2. **Prototype-only functionality:** core commerce and communication actions are placeholders.
3. **Monolithic code:** almost all React logic and content live in one 1,216-line file.
4. **No data architecture:** product/content records are hard-coded into UI files.
5. **No quality safety net:** no tests, linting, formatting, CI, or accessibility automation.
6. **No delivery documentation:** users cannot tell which prototype to run or deploy.
7. **No legal/licensing documentation:** code and image use terms are unspecified.
8. **Third-party dependence:** fonts, product photos, placeholder photos, and—in the standalone prototype—CSS/JS depend on external services.
9. **Known vulnerable development dependencies:** npm audit is not clean.
10. **Unverified business content:** claims, testimonials, founder details, pricing, guarantees, locations, and contact details need validation.

## 14. Prioritized recommendations

### Priority 1 — Decide what the repository is

- Choose **Mukango Wa Africa** or **The African Touch** as the canonical brand.
- Select one implementation as the maintained application.
- Document whether the other HTML page is an earlier concept, and archive it outside the deploy path if it must be retained.
- Remove the redundant ZIP from version control or publish it as a release artifact instead.
- Remove the orphan root lockfile or create a deliberate root workspace/package structure.

### Priority 2 — Establish basic repository hygiene

- Add a README with purpose, screenshots, prerequisites, install/run/build/deploy instructions, architecture, and known limitations.
- Add `.gitignore` for `node_modules`, `dist`, logs, editor files, and generated Python files.
- Add an explicit license and image/third-party attribution information.
- Pin/document the supported Node and npm versions.
- Add ESLint, Prettier, `typecheck`, and corresponding npm scripts.
- Add CI that installs with `npm ci`, type-checks, lints, tests, builds, and audits.

### Priority 3 — Resolve functionality and data behavior

- Implement product routing/details, working category filters, search, and cart—or clearly label/remove those controls.
- Connect forms to a real, consent-aware endpoint and display responses based on actual requests.
- Correct the standalone form `name` attributes and replace `alert()` interactions.
- Move catalog/editorial data into typed modules, a CMS, or an API.
- Split `App.tsx` into components, data, hooks, and styles.
- Remove the unused `cn` utility/dependencies or use it consistently.

### Priority 4 — Security, accessibility, and reliability

- Upgrade Vite and affected transitive dependencies, then rerun `npm audit` and the build.
- Replace Tailwind CDN usage in any retained production page with a compiled build.
- Add CSP and deliberate third-party resource policies at deployment.
- Add labels, live regions, focus states, reduced-motion support, menu ARIA state, and true keyboard-operable product controls.
- Keep visually closed navigation out of the tab order.
- Add component and end-to-end coverage for navigation, filters, menus, forms, and responsive states.
- Add automated accessibility testing, then perform manual keyboard/screen-reader checks.

### Priority 5 — Performance, SEO, and content

- Self-host or formally approve external images/fonts.
- Optimize JPEGs and produce responsive AVIF/WebP variants with dimensions and lazy loading.
- Add meta description/OG data, canonical metadata, favicon, structured data, sitemap, and robots policy.
- Verify all names, claims, prices, locations, testimonials, guarantees, contact details, copyright years, and image rights.
- Add real privacy and terms pages before collecting personal information.

## 15. Bottom line

The repository contains strong visual concepts and a buildable React landing page, but it is currently an **early design/prototype package** rather than a complete website or commerce platform. The most important next decision is selecting the canonical brand and implementation. From there, the project needs basic documentation and hygiene, real interaction/data behavior, dependency remediation, accessibility work, testing/CI, and verified production content before it can be considered launch-ready.
