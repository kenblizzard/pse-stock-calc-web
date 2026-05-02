## ADDED Requirements

### Requirement: Responsive calculator navigation
The system SHALL provide a lightweight application shell that lets users navigate between the three calculators on phones, tablets, and desktops.

#### Scenario: Mobile user changes calculators
- **WHEN** the user opens the app on a narrow viewport
- **THEN** the system presents compact navigation that keeps calculator switching accessible without obscuring the current form

#### Scenario: Desktop user changes calculators
- **WHEN** the user opens the app on a wide viewport
- **THEN** the system presents navigation and content spacing optimized for larger screens while preserving the same calculator routes

### Requirement: Non-intrusive ad placement regions
The system SHALL include reserved ad placement regions that do not block form fields, force modal interruptions, or shift active inputs during calculator use.

#### Scenario: Ad slot is empty or disabled
- **WHEN** no ad content is available for a reserved slot
- **THEN** the system preserves a clean layout without leaving broken placeholders or blocking calculator interactions

#### Scenario: Ad slot is enabled
- **WHEN** ad content is rendered in a reserved slot
- **THEN** the system keeps the calculator workflow usable and visually distinct from the ad content
