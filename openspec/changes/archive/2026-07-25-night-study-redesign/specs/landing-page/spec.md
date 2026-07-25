## ADDED Requirements

### Requirement: Landing page hero section
The system SHALL display a hero section on the landing page with a Crimson Pro display headline, subtitle, and CTA button.

#### Scenario: Hero renders headline and CTA
- **WHEN** a visitor loads the landing page
- **THEN** the system SHALL display the headline "Where Knowledge Meets Devotion" in Crimson Pro font, a subtitle "Learn Quran, Hadith, Fiqh and more with expert teachers worldwide", and a "Start Learning" CTA button with amber accent linking to onboarding or dashboard

#### Scenario: Hero has lamplight glow effect
- **WHEN** the hero section renders
- **THEN** it SHALL display a subtle radial gradient (amber to transparent) behind the content

#### Scenario: Hero animates on page load
- **WHEN** the landing page loads
- **THEN** the hero SHALL fade in with opacity 0 to 1 and translateY 20px to 0 animation

### Requirement: Landing page features section
The system SHALL display a 3-column features section with Expert Teachers, Structured Curriculum, and Track Your Progress cards.

#### Scenario: Features render with icons and glow
- **WHEN** the features section is visible
- **THEN** the system SHALL display three cards (BookOpen, Layers, TrendingUp icons) using `bg-surface` with `border` styling and a warm glow hover effect from below

#### Scenario: Features are responsive
- **WHEN** the page is viewed on mobile
- **THEN** the feature cards SHALL stack in a single column; on tablet they SHALL use 2 columns; on desktop they SHALL use 3 columns

### Requirement: Landing page stats section
The system SHALL display a stats section showing key metrics.

#### Scenario: Stats render with accent styling
- **WHEN** the stats section is visible
- **THEN** the system SHALL display "1,200+ Students", "50+ Courses", "95% Completion" with amber accent numbers and muted labels

### Requirement: Landing page testimonial section
The system SHALL display a testimonial section with a quote and attribution.

#### Scenario: Testimonial renders centered
- **WHEN** the testimonial section is visible
- **THEN** the system SHALL display a quote with attribution in centered, muted styling

### Requirement: Landing page final CTA section
The system SHALL display a final call-to-action section.

#### Scenario: Final CTA renders with amber button
- **WHEN** the final CTA section is visible
- **THEN** the system SHALL display "Begin Your Journey" text with an amber button and subtle glow shadow

### Requirement: Landing page footer
The system SHALL display a footer with logo, links, and copyright using theme tokens.

#### Scenario: Footer renders with theme tokens
- **WHEN** the footer section is visible
- **THEN** the system SHALL display the logo, navigation links, and copyright text using CSS variable tokens

### Requirement: Landing page animations
The system SHALL animate landing page sections on load with staggered fade-in effects.

#### Scenario: Sections animate on load
- **WHEN** the landing page loads
- **THEN** sections SHALL fade in with opacity 0 to 1 and translateY 20px to 0, with staggered children fade-in

#### Scenario: Reduced motion disables animations
- **WHEN** the user has `prefers-reduced-motion` enabled
- **THEN** all landing page animations SHALL be disabled
