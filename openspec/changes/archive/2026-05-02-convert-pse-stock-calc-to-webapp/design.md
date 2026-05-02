## Context

The source Android app already contains the domain rules that matter most: transaction fee computation, PSE tick-size increments, board-lot mapping, break-even price search, and the three calculator workflows exposed in navigation. The target workspace is currently OpenSpec-only, so this change will define a clean first web implementation rather than adapt an existing frontend codebase.

The web version needs to be mobile responsive, fast on low-end devices, simple to maintain, and ready for non-intrusive monetization. Because the calculators are deterministic and do not require authentication or user accounts, the first release can remain frontend-only and ship as a static SPA.

## Goals / Non-Goals

**Goals:**
- Deliver a lightweight Vue web app that reproduces the three working Android calculators.
- Preserve calculation parity for fees, board lots, tick sizes, and break-even behavior.
- Use a mobile-first layout that still feels natural on tablet and desktop widths.
- Keep the implementation modular so calculator rules can be unit tested independently from the UI.
- Reserve stable ad regions in the layout without blocking inputs or forcing interstitial flows.

**Non-Goals:**
- Recreate Android-specific services such as Firebase Analytics, native AdMob SDKs, or rate-this-app prompts in the first release.
- Ship the unfinished cash dividend screen as part of the initial web migration.
- Add backend persistence, user accounts, cloud sync, or real-time market data.
- Build a heavy design system or animation-rich interface that increases bundle size without improving calculator usability.

## Decisions

### Use Vue 3 + Vite + TypeScript + Tailwind CSS

The web app will use Vue 3 with Vite for fast iteration and small production bundles, TypeScript for safer porting of financial logic, and Tailwind CSS for a mobile-first responsive layout without maintaining large custom stylesheets.

Alternatives considered:
- React/Next.js: more infrastructure than needed for a calculator-first SPA.
- Nuxt: valuable for content-heavy SEO sites, but unnecessary for the first static calculator release.
- Plain Vue without Tailwind: workable, but slower to compose responsive utility-driven layouts and ad slot spacing.

### Keep business logic in framework-agnostic domain modules

PSE fee rates, board lots, tick sizes, and calculation helpers will live in typed utility modules and composables, separate from view components. This keeps parity verification straightforward and reduces the risk of UI refactors changing financial behavior.

Alternatives considered:
- Embedding formulas directly inside components: faster initially, but harder to test and reuse across calculators.
- Centralized global store for all calculations: unnecessary for mostly local form-driven workflows.

### Use route-level calculator pages with a shared shell

The app shell will provide a simple top navigation or segmented mobile tab navigation for the three calculators, with shared header/footer/ad-slot regions. Each calculator page will own its local form state and derived results.

Alternatives considered:
- Single-page multi-section scroll layout: simpler routing, but weaker deep-linking and harder to preserve focused task flows.
- Full global state with Pinia: not needed unless future releases add saved sessions or cross-page state restoration.

### Favor native browser APIs plus small support libraries

Recommended supporting libraries:
- `vue-router` for page routing
- `vee-validate` + `zod` for input parsing and validation rules
- `vitest` for calculator/domain unit tests
- `playwright` for key browser-level regression checks

Number formatting should use `Intl.NumberFormat` instead of a dedicated formatting library to keep dependencies light. Fee defaults can live in a static config object now, with a clean seam for future remote configuration.

Alternatives considered:
- Pinia: defer until persistent or cross-route state becomes a real need.
- Big decimal libraries: not required initially if parity checks confirm `number` precision is sufficient for supported inputs; can be introduced later if discrepancies appear.

### Replace intrusive ad behavior with reserved placement zones

The initial web release will not implement popup or interstitial ads. Instead, the layout will include dedicated banner/container regions beneath headers or between major sections so ads can be enabled later without shifting the surrounding form structure.

Alternatives considered:
- Immediate ad network integration: adds complexity and consent concerns before the core migration is validated.
- No ad placeholders at all: simpler now, but forces a later layout redesign.

## Risks / Trade-offs

- [Numeric parity drift between Java/Kotlin and JavaScript] -> Mitigation: port formulas into isolated tests with fixture cases copied from the Android logic and validate break-even/tick-size behavior explicitly.
- [Frontend-only fee defaults can become stale if exchange fees change] -> Mitigation: isolate fee configuration in one module and design the app to accept future remote-config or CMS-backed values.
- [Overusing libraries in a small app] -> Mitigation: keep the dependency list minimal and avoid state/query libraries until the product actually needs them.
- [Ad slots may reduce visible space on small screens] -> Mitigation: make ad containers collapsible/empty by default and keep core calculator controls above the first fold where possible.
- [Multiple-buys UX can become cluttered on phones] -> Mitigation: use compact repeatable cards, cap visible entries initially to preserve clarity, and keep summary metrics sticky or visually prominent.

## Migration Plan

1. Create the Vue/Vite/Tailwind application scaffold and base routes.
2. Port the PSE trading rules into tested TypeScript modules.
3. Build the shared responsive shell and empty ad slot containers.
4. Implement the price/profit calculator, then the buying-power calculator, then the multiple-buys calculator.
5. Add parity-focused unit tests plus a small browser regression suite for the primary flows.
6. Deploy as a static web app; rollback is straightforward by reverting to the previous static deployment because no backend migration is involved.

## Open Questions

- Should the final web app use hash routing or history routing based on the intended hosting platform?
- Does the user want fee values to remain hardcoded initially, or should the first release include a small editable settings panel for advanced users?
- Should ad placeholders remain generic containers only, or should the initial implementation wire in a specific web ad provider?
