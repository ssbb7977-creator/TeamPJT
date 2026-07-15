# Home Page Design Plan

Source: `home_localhub/code.html`

Goal
- Capture visual design intent from `home_localhub/code.html` and produce a true "design plan" focused on visual tokens, component anatomy, layout rules, and interaction specifications — not an implementation task list.

Design Summary
- Visual theme: "Marine Modern" — deep-sea primary blue for CTAs and interactive elements, pale-sky secondary for accents, warm sandy tertiary for subtle badges.
- Typography: `Be Vietnam Pro` for headlines, `Noto Sans` for body text; use scale: display-lg (48px), headline-lg (32px), body-md (16px).
- Spacing & Grid: 12-column desktop grid; gutters 24px; mobile collapse to single column. Use 8px baseline grid for spacing.
- Elevation: soft ambient shadows (L1/L2) and subtle 1px strokes on cards.

Component Specs
- `HeroBanner` (large):
  - Layout: 2-column on desktop; left text content, right promotional card.
  - Padding: 32px desktop, 20px mobile. Background: gradient using `primary-container` to `primary`.
  - CTA: primary (filled) + secondary (outline) buttons.

- `WeatherWidget` (compact):
  - Card size: ~280x120, shows date, location, current temp and small stats.

- `RecommendedPlaces` / `FestivalList` / `FeatureCard`:
  - Card radius: 16px, image clipped to top-left radius, text area with tag chip and distance.

- `ChatFloating` (FAB + sheet):
  - FAB: 56px circle with provided image; contrast-compliant border if on light background.
  - Chat window: 320x420 modal above FAB; on mobile becomes bottom sheet (50vh).
  - Interaction: focus input when opened, ESC to close, save history to `localStorage`.

Layout Rules
- Header: sticky top, use `surface` background and subtle border-bottom.
- Main area: hero (full-width) then content grid (primary column left, sidebar right).
- Sidebar: fixed max-width and independent vertical scroll for lists; keep map out of home.

Accessibility
- All buttons and links must have `aria-label` attributes when icons are used.
- Color contrast: ensure primary button text on primary background meets AA contrast.
- Keyboard: chat should trap focus while open; use `role="dialog"` and `aria-modal="true"`.

Interaction Details
- Festival card click: deep link to `/map?focus=<id>&category=festival` (already implemented); Map must handle this query.
- FAB: hide when chat open; chat auto-focus on input. Keyboard ESC closes chat.

Design QA Checklist
- Layout matches the reference (hero, highlights, festivals, sidebar)
- Spacing and typography use tokens above
- Components render consistently across breakpoints
- Chat behavior accessible and persistent local history

Notes for Implementation
- This document is design-first. Implementation steps exist in `design/board_design_plan.md` as actionable items; keep them separate.

Next Design Task
- Implement `HeroBanner` visual variants and finalize imagery and copy for production.


