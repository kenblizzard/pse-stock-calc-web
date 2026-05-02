## Purpose
Define the shared PSE trading rules engine that centralizes fee computation, board-lot rules, tick sizes, and related configuration for all calculators.

## Requirements

### Requirement: Shared transaction fee computation
The system SHALL expose a reusable calculation module that computes commission, VAT, PSE transaction fee, SCCP fee, sales tax, and total fees for buy and sell transactions using the configured fee schedule.

#### Scenario: Buy transaction omits sales tax
- **WHEN** the calculator computes fees for a buy transaction
- **THEN** the resulting fee breakdown excludes sales tax and still includes the remaining required fee components

#### Scenario: Minimum commission is enforced
- **WHEN** the calculated commission falls below the minimum supported amount
- **THEN** the system applies the configured minimum commission before computing the total fee

### Requirement: Shared PSE board-lot and tick-size rules
The system SHALL expose reusable functions that return board-lot sizes and tick-size increments for supported price ranges and use those rules consistently across calculators.

#### Scenario: Board-lot lookup is used in budget planning
- **WHEN** the buying-power calculator computes purchasable shares
- **THEN** the system uses the shared board-lot lookup to round shares down to a valid quantity

#### Scenario: Tick-size lookup is used in break-even pricing
- **WHEN** a calculator searches for break-even sell price
- **THEN** the system increases sell price only by valid tick-size increments for the relevant price range

### Requirement: Rule configuration can be updated centrally
The system SHALL keep fee-rate and trading-rule configuration in a central module so future updates do not require rewriting calculator UI logic.

#### Scenario: Fee defaults change
- **WHEN** maintainers update the shared fee configuration
- **THEN** all calculators use the new values without duplicating rule changes across pages
