## 1. Project setup

- [x] 1.1 Scaffold a Vue 3 + Vite + TypeScript app in the workspace and add Tailwind CSS
- [x] 1.2 Add the supporting dependencies for routing, validation, unit testing, and browser regression testing
- [x] 1.3 Create the base source structure for routes, components, composables, domain utilities, config, and tests

## 2. Shared calculation engine

- [x] 2.1 Port the PSE fee schedule, minimum commission, board-lot table, and tick-size table into typed shared config/util modules
- [x] 2.2 Implement reusable functions for fee breakdowns, total amounts, board-lot rounding, and break-even price search
- [x] 2.3 Add unit tests that verify parity for buy fees, sell fees, board lots, tick sizes, and break-even calculations

## 3. Responsive app shell

- [x] 3.1 Implement the app shell with mobile-first navigation for the three calculator routes
- [x] 3.2 Add responsive layout containers and reserved non-intrusive ad slots that degrade cleanly when empty
- [x] 3.3 Add shared number formatting, form helpers, and route-level page scaffolds

## 4. Calculator pages

- [x] 4.1 Build the price and profit calculator page with live derived totals, break-even price, and gain/loss summaries
- [x] 4.2 Build the buying-power calculator page with board-lot-compliant share estimation and a handoff action to the price/profit calculator
- [x] 4.3 Build the multiple-buys calculator page with add/remove entry flows, aggregate totals, and a handoff action to the price/profit calculator

## 5. Quality and release readiness

- [x] 5.1 Add browser-level tests for the primary calculator flows and responsive navigation
- [x] 5.2 Verify mobile and desktop layouts, including behavior with empty ad slots
- [x] 5.3 Prepare the static deployment configuration and document any remaining hosting or ad-provider decisions
