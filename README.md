# PSE Stock Calc Web

A lightweight Vue 3 web app that ports the original Android PSE stock calculator into a mobile-first browser experience.

## Included calculators

- `Price & Profit`: buy fees, sell proceeds, break-even price, and profit/loss
- `Buying Power`: board-lot-aware purchase planning from a target budget
- `Multiple Buys`: weighted average entry price across up to five buy transactions

## Stack

- Vue 3 + Vite + TypeScript
- Tailwind CSS
- Vue Router
- Vitest for rules-engine/unit tests
- Playwright for browser regression checks

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## Deployment

The app uses hash-based routing, so the built `dist/` folder can be deployed to most static hosts without server-side rewrite rules.

Example Netlify flow:

```bash
npm run build
```

- Publish directory: `dist`
- Build command: `npm run build`

## Remaining decisions

- Pick the final static host if you do not want to use the included `netlify.toml`
- Decide whether ad placeholders stay generic or get wired to a specific web ad provider
- Decide whether exchange fee values remain code-configured or become remotely editable later
