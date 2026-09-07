# Ingizer Design System

> **ingizer** — _#EmpowerYourBusiness_
> An AI platform for financial consulting.
> The name is a portmanteau: **in**(telligence) + **gizer** (energy).

This repository is the source of truth for the ingizer brand, translated into
production-ready design tokens, typography, color, motion, and visual rules.
Use it to build interfaces that feel unmistakably "ingizer" — analytical,
energetic, and confident.

---

## Brand snapshot

| | |
|---|---|
| **Category**           | AI-powered financial consulting (SaaS / fintech) |
| **Audience**           | Enterprise CFOs, SMBs, individual investors, internal finance teams |
| **Voice**              | Energetic, intelligent, data-driven — a fintech tone in the Stripe / Mercury family |
| **Working language**   | English (the marketing tagline `#EmpowerYourBusiness` sets the register) |
| **Primary metaphor**   | A **performance meter** — the literal red→green gauge in the logo. Treat it as the brand's signature device. |

### Sources used to build this system

| Source | Path / link | Notes |
|---|---|---|
| Official logo, RGB | `assets/INGIZER_LOGOS-RGB_5.png` | Provided as the master asset (2000×2000 transparent PNG) |
| Logos source file  | `Logos/Logos RGB.ai`  *(local — not imported)* | Adobe Illustrator file. Cannot be re-saved into the project; ask the designer to export SVG/PNG variants and drop them in `assets/`. |
| Brand manual       | `Logos/Ingizer_Manual de marca 2026.ai` *(local — not imported)* | The 2026 brand book. Same Illustrator-only limitation as above. **All rules below are derived from the logo and the briefing call; please cross-check against the manual and flag any divergence.** |

---

## Index — what's in this repo

```
.
├── README.md                  ← you are here
├── SKILL.md                   ← agent-skill manifest (Claude Code compatible)
├── colors_and_type.css        ← all design tokens (color, type, spacing, radii, shadow, motion)
├── assets/                    ← logos, marks, lockups
│   ├── INGIZER_LOGOS-RGB_5.png      master logo (mark + wordmark + tagline)
│   ├── ingizer-mark.png             symbol only (square, transparent)
│   ├── ingizer-wordmark.png         wordmark + tagline only
│   ├── ingizer-lockup.png           horizontal lockup (mark + wordmark)
│   ├── ingizer-mark-on-dark.png     mark recoloured for dark backgrounds
│   └── ingizer-lockup-on-dark.png   horizontal lockup, dark-bg version
└── preview/                   ← Design System tab cards
    ├── brand-*.html
    ├── colors-*.html
    ├── type-*.html
    ├── spacing-*.html
    └── components-*.html
```

UI kits (landing, dashboard, AI chat, mobile app) are **out of scope for this
pass** — the user requested foundations only. When ready, they will live under
`ui_kits/<product>/`.

---

## Content fundamentals

### Voice

- **Energetic, but composed.** We're a finance product — we don't shout. The
  energy comes from clarity and decisiveness, not exclamation marks.
- **Analytical confidence.** Lead with the number. "Cut close-of-books from 9
  days to 2." "Forecast accuracy up 34%."
- **Empowerment, not magic.** AI is the engine, never the hero. The user — the
  CFO, the consultant, the analyst — is the hero.
- **English everywhere** in product surfaces. The team is bilingual; internal
  docs may be in Spanish, but anything customer-facing ships in English.

### Casing & punctuation

- **Lowercase the brand**: always `ingizer`, never "Ingizer" or "INGIZER",
  even at the start of a sentence. The mark itself is set lowercase.
- **Sentence case** for all UI: page titles, buttons, menu items, table
  headers. Reserve TITLE CASE only for the eyebrow / overline label style.
- **Tagline**: `#EmpowerYourBusiness` is set as a single PascalCase hashtag,
  never broken into words, never lowercased. It's a flourish — use sparingly
  (footers, hero accents, social), not as body copy.
- **Numbers**: always tabular figures in tables and KPIs (`font-variant-numeric: tabular-nums`).
  Use `1,234.56` (US English). Currency: `$1,234.56` USD by default; respect
  locale formatting in product.
- **Oxford comma**: yes.

### Sample copy — what to write

| Surface | Do | Don't |
|---|---|---|
| Hero       | _"Forecast cash. Spot drift. Act before the quarter does."_ | _"Welcome to ingizer, your AI partner!"_ |
| CTA        | _"Run a forecast"_ · _"See your meter"_ · _"Connect your ledger"_ | _"Get started today!"_ · _"Click here"_ |
| Empty state| _"No anomalies this period. Your meter is in the green."_ | _"Nothing here yet :)"_ |
| Error      | _"We couldn't reach your bank feed. Retry, or check the connection."_ | _"Oops! Something went wrong."_ |
| AI reply   | _"Revenue is tracking 8.2% below plan, driven mainly by SMB churn in March. Here are the three accounts that moved most."_ | _"Sure! I can help with that. Let me think…"_ |

### Emoji & flourishes

- **No emoji** in product surfaces, marketing, or AI replies. The hashtag in
  the lockup (`#EmpowerYourBusiness`) is the brand's only flourish.
- The **meter spectrum** itself is our visual emoji — when you'd reach for a
  color reaction, use the gauge instead.

---

## Visual foundations

### Color

Two families, both anchored in the logo:

- **Brand navy** `#081C2A` is the wordmark colour — it's the primary text, the
  primary CTA fill, and the dark-mode page background. Three deeper steps
  (`navy-700/800/900`) build elevation in dark mode.
- **The meter spectrum** — `red #FF2E27` → `orange #FF8F1B` → `yellow #FCD006`
  → `lime #9FDA20` → `green #04C537` — is the signature accent system. It
  doubles as semantic status (danger, warning, caution, improving, success)
  and as data-viz vocabulary. Use the full gradient (`--gradient-meter`)
  sparingly: hero accents, charged data states, the literal gauge component.
  **Never as a generic page background.**

The neutral stack is cool and slightly blue-tinted (`#F7F9FB` … `#0E1822`) so
greys read as siblings of the navy, not as a separate, warm system.

See `colors_and_type.css` for the full token table; components should consume
**semantic** tokens (`--fg-1`, `--bg-surface`, `--action-primary-bg`) — never
brand tokens directly — so dark mode and re-themes flow through cleanly.

### Typography

- **Display & body**: **Poppins** (Google Fonts, OFL-licensed). Geometric
  sans, weights 300–800 available. Closest free match to the wordmark's
  letterforms (double-storey `g`, circular bowls).
  - 🚩 **Substitution flag**: We don't have a custom ingizer typeface. If the
    brand manual specifies a different font, please send the file and we'll
    swap the `@font-face` declarations in `colors_and_type.css`.
- **Mono**: **JetBrains Mono** (CDN). For code, KPIs in dashboards, and any
  context where digits must align.
- **Modular scale**: 1.25 (minor third) for display, 1.125 for body. 16px base.
- **Tracking**: tighten display (`-0.02em` to `-0.04em`), normal on body, very
  wide (`+0.12em`) on uppercased eyebrows only.
- **Numbers** in tables and KPIs: always `tabular-nums lining-nums` so columns
  align — non-negotiable in a finance product.

### Iconography

- **No bespoke icon set yet.** For all production work we use **Lucide**
  ([lucide.dev](https://lucide.dev), ISC license) — strokes, 1.5px stroke
  weight, 24×24 grid. Lucide's geometric, even-weighted vocabulary harmonises
  with Poppins and the rounded-but-precise feel of the logo.
  - 🚩 **Substitution flag**: this is our recommendation, not a confirmed
    brand decision. If the manual specifies a different family (Iconoir,
    Phosphor, custom), let us know.
- Load via CDN: `https://unpkg.com/lucide-static@latest/icons/<name>.svg`
  or the Lucide React/web-component package in product code.
- **Stroke colour** always inherits `currentColor`; size with CSS, never with
  the SVG `width`/`height` attributes.
- **No emoji as icons.** No unicode glyph icons (`✓`, `→`) in product UI;
  use Lucide's `check` and `arrow-right` instead.
- The **logo mark** is iconographic in its own right — it is the only "filled,
  multi-colour" mark allowed in product. Use `assets/ingizer-mark.png` (or its
  on-dark variant) for app icons, loading states, and the splash.

### Backgrounds & surfaces

- **Light mode is the default.** Page background is `--neutral-50` (off-white
  with a cool cast). Cards sit on pure white at `--bg-surface`.
- **Dark mode** uses `--brand-navy-900` for the page and `--brand-navy` for
  surfaces — i.e. the wordmark colour becomes a surface.
- **No full-bleed photography** by default. The brand has no licensed photo
  library yet; if a hero needs imagery, use a charged-navy radial
  (`--gradient-navy-charge`) or the meter arc as a graphic device.
- **No textures, no grain, no noise.** This is a finance product — the surface
  should feel calibrated.
- **Patterns**: a single sanctioned motif — the meter arc itself, sometimes
  rendered as concentric arcs or a subtle SVG watermark behind hero numbers.

### Borders, shadows, elevation

- **Borders are the default separator.** 1px, `--border-subtle` (`#E1E7ED`).
  Cards usually carry **either** a 1px border **or** a soft shadow — not both.
- **Shadow stack** is navy-tinted (not pure black) so cards float gently on
  cool neutrals: `--shadow-xs` … `--shadow-xl`. Five steps.
- **Inner shadow** (`--shadow-inset`) is reserved for sunken surfaces (search
  fields, code blocks, "input wells").
- **Focus ring**: `0 0 0 3px rgba(4, 197, 55, 0.35)` — a green halo, echoing
  the meter's peak end. Always visible on `:focus-visible`.

### Radii & shape language

- **Soft, not pillowy.** The mark is a perfect circle, the wordmark has
  rounded counters but no rounded terminals. Match that:
  - Inputs / buttons: `--radius-md` (10px)
  - Cards: `--radius-lg` (14px)
  - Modals / sheets: `--radius-xl` (20px)
  - Pills (chips, status badges): `--radius-pill`
- **Avoid** sharp 0px corners (too institutional) and 24px+ on small UI (too
  consumer).

### Motion

- **Snappy, not bouncy.** Default duration 220ms, default easing
  `cubic-bezier(0.22, 1, 0.36, 1)` (a fast-out, soft-land curve).
- **Hover**: 80–150ms, opacity / colour shift only — no scale.
- **Press**: instant background-darken, no shrink/scale transform.
- **Spring** (`--ease-spring`, slight overshoot) is reserved for celebratory
  state changes — a forecast completing, the gauge filling, an anomaly being
  resolved. Not for everyday UI.
- **No looping ambient animation** in the product UI (drains attention in a
  finance app). On marketing surfaces, the meter arc may slowly pulse.

### Hover & press states

| State | Treatment |
|---|---|
| Hover (primary action) | Background lifts ~6% lighter (`#122E45` from navy) |
| Hover (accent / green) | Background `#06B033` (slightly darker green) |
| Hover (ghost / link)   | Background `--neutral-100`; underline thickens |
| Active / press         | Background darker by another step; **no transform** |
| Disabled               | `opacity: 0.5`; `cursor: not-allowed`; no hover effects |
| Focus-visible          | `--ring-focus` (green halo); never replaces hover style |

### Layout

- **Container widths**: 640 / 768 / 1024 / 1280 / 1440 px breakpoints.
  Marketing pages cap at 1280; product pages flex full-width with internal
  rails.
- **Grid**: 12-column on ≥1024px, 6 on tablet, 4 on mobile. 24px gutter, 32px
  on large.
- **Vertical rhythm**: section spacing comes from the spacing scale only —
  no ad-hoc `margin: 73px`. Common: `--space-16` (64px) between sections,
  `--space-24` (96px) for hero breathers.
- **Fixed elements**: the global nav is 64px tall; the dashboard sidebar is
  240px expanded / 64px collapsed.

### Transparency & blur

- **Blur is rare.** Reserved for: modal scrims (`backdrop-filter: blur(8px)`),
  a sticky table-header dissolve effect, and the iOS app's tab bar.
- **Transparency** in solid colours: avoid for text (always use a flat tone
  from the neutral stack). Only used in shadows and focus rings.

### Imagery vibe (when imagery enters)

When real photography is added later, target: **cool-leaning, low-contrast,
desaturated, warm-skin-tones-allowed, no heavy grain, no filters**. Think
Mercury / Ramp's brand photography — credible, calm, slightly editorial. No
stock-photo "businesspeople pointing at charts".

### Cards

A card in ingizer is:
- `background: var(--bg-surface)` (white in light mode, navy in dark)
- `border: 1px solid var(--border-subtle)` **or** `box-shadow: var(--shadow-sm)`
- `border-radius: var(--radius-lg)` (14px)
- Padding: `--space-6` (24px) for content cards, `--space-4` (16px) for compact

Avoid the "rounded card with coloured left-border accent" pattern — it's an AI
trope and undermines the calibrated feel.

---

## Caveats & open questions

- The brand manual (`Ingizer_Manual de marca 2026.ai`) couldn't be imported
  into this project (Illustrator format isn't supported here). All rules in
  this document are derived from the master logo PNG and the briefing call.
  **Please cross-check against the manual and flag any divergence.**
- **Typeface is a Google Fonts substitution (Poppins).** Replace with the
  brand's licensed face when available.
- **Iconography is recommended, not confirmed.** Lucide is our default; happy
  to swap.
- **No photography or illustration system** exists yet. When that direction is
  decided, this README's _Imagery vibe_ section will be expanded.
- **No UI kits in this pass.** Foundations only, per scope.

---

## How to use these tokens

```html
<link rel="stylesheet" href="colors_and_type.css">

<button style="
  background: var(--action-primary-bg);
  color:      var(--action-primary-fg);
  padding:    var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font: var(--weight-semibold) var(--fs-md)/1 var(--font-body);
  transition: background var(--dur-fast) var(--ease-out);
">Run a forecast</button>
```

For dark mode, set `data-theme="dark"` on `<html>` (or any container) — every
semantic token flips; brand tokens stay constant.
