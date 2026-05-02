## ADDED Requirements

### Requirement: Price and profit calculation
The system SHALL allow the user to enter number of shares, buy price, and sell price, then compute buy-side fees, buy total amount, sell-side fees, sell total amount, break-even price, broker-style profit/loss, and overall profit/loss using the shared PSE trading rules engine.

#### Scenario: Valid inputs produce computed totals
- **WHEN** the user provides a valid share count, buy price, and sell price
- **THEN** the system displays all derived totals and profit metrics without requiring a page refresh

#### Scenario: Break-even price is derived from PSE tick sizes
- **WHEN** the user enters a valid share count and buy price
- **THEN** the system computes the minimum sell price that recovers the buy-side total amount using valid PSE tick-size increments

### Requirement: Profit results remain understandable on small screens
The system SHALL present profit results in a mobile-friendly summary that distinguishes sell-side profit/loss from total profit/loss including buy-side fees.

#### Scenario: Positive and negative outcomes are visually distinguishable
- **WHEN** computed profit is above or below zero
- **THEN** the system uses clear visual treatment and labels so users can distinguish gain from loss on mobile and desktop layouts
