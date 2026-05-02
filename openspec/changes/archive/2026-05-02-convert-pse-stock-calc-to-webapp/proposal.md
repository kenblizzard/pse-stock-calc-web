## Why

The existing PSE stock calculator only exists as an old Android app, which limits reach, maintainability, and discoverability for users who primarily access tools from mobile browsers and desktop web. Converting it into a lightweight responsive web app makes the calculators easier to use, easier to update, and better suited for gradual monetization through unobtrusive ad placements.

## What Changes

- Rebuild the app as a Vue-based web application with a simple mobile-first interface and fast page loads.
- Preserve the working calculator flows from the Android app: stock price and profit, budget-based share planning, and multiple-buy average price computation.
- Port the PSE-specific computation rules for fees, board lots, tick sizes, break-even pricing, and profit summaries into a reusable JavaScript/TypeScript domain layer.
- Replace the Android drawer-style navigation with a lightweight responsive web shell that works well on phones and scales cleanly to larger screens.
- Add reserved ad slots that do not block the main workflow and can be enabled later without redesigning the UI.
- Keep the initial release frontend-first, with static configuration for fee defaults and room for later remote configuration if needed.

## Capabilities

### New Capabilities
- `price-profit-calculator`: Let users compute buy totals, sell totals, break-even price, and profit/loss from shares, buy price, and sell price.
- `buying-power-calculator`: Let users estimate board-lot-compliant purchasable shares, fees, total amount, remaining buying power, and break-even price from a budget and target buy price.
- `multiple-buys-calculator`: Let users add and remove buy entries, then compute combined shares, total cost, and weighted average entry price.
- `responsive-app-shell`: Provide mobile-first navigation, lightweight styling, and dedicated non-intrusive ad placement areas around calculator content.
- `pse-trading-rules-engine`: Preserve and expose the PSE fee, tick size, and board lot rules used by all calculator experiences.

### Modified Capabilities

None.

## Impact

- Affects the new web frontend architecture, routing, state management, form handling, and styling approach.
- Introduces a Vue + Tailwind-based UI stack plus supporting libraries for forms, validation, number formatting, and testing.
- Replaces Android-only UI patterns and ad SDK integration with web-ready layout regions and deferred ad integration points.
- Requires careful parity validation against the Android app's existing formulas and edge-case rounding behavior.
