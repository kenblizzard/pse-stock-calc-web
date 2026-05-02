## Purpose
Define the buying power calculator behavior for turning a budget and target price into a board-lot-compliant purchase plan with follow-up profit analysis.

## Requirements

### Requirement: Buying power share estimation
The system SHALL allow the user to enter available buying power and a target buy price, then compute the largest purchasable share quantity that satisfies PSE board-lot rules and does not exceed the entered budget after fees.

#### Scenario: Budget is reduced to a valid board-lot purchase
- **WHEN** the entered budget can buy shares only after board-lot rounding and fee adjustment
- **THEN** the system returns the highest valid board-lot-compliant share quantity that remains within the buying power limit

### Requirement: Buying power result details
The system SHALL display the derived board lot, average price per share, total fees, total amount, remaining buying power, and break-even price for the computed purchase plan.

#### Scenario: Valid budget inputs show detailed purchase metrics
- **WHEN** the user provides a valid buying power amount and buy price
- **THEN** the system shows the computed detail metrics alongside the purchasable share quantity

### Requirement: Buying power results can seed the price and profit calculator
The system SHALL provide an action that opens or routes to the price and profit calculator using the computed share count, buy price, and break-even sell price as initial values.

#### Scenario: User continues from purchase planning to profit analysis
- **WHEN** the user activates the follow-up action from a valid buying-power result
- **THEN** the system opens the price and profit calculator with the derived values prefilled
