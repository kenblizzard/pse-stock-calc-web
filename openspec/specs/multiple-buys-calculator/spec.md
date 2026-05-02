## Purpose
Define the multiple buys calculator behavior for combining several stock entries into a weighted average position that can flow into profit analysis.

## Requirements

### Requirement: Multiple buy entries
The system SHALL allow the user to manage a list of buy entries, where each entry includes number of shares and buy price and contributes to a combined weighted average position.

#### Scenario: User adds buy entries
- **WHEN** the user adds a new buy entry
- **THEN** the system appends a new editable entry row or card without clearing existing values

#### Scenario: User removes buy entries
- **WHEN** the user removes an existing buy entry
- **THEN** the system recalculates the combined totals using the remaining entries only

### Requirement: Combined average computation
The system SHALL compute total shares, total buy amount including fees, and weighted average price per share across all valid buy entries using the shared PSE trading rules engine.

#### Scenario: Combined totals update after entry changes
- **WHEN** the user changes shares or buy price in any valid entry
- **THEN** the system updates the combined totals and weighted average without a page reload

### Requirement: Multiple buys output can seed profit analysis
The system SHALL provide an action that opens or routes to the price and profit calculator using the combined share total and weighted average price as initial values.

#### Scenario: User moves from averaging to profit planning
- **WHEN** the user activates the profit analysis action from the multiple-buys calculator
- **THEN** the system opens the price and profit calculator with the aggregate position prefilled
