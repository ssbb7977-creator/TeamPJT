# Home Page Design Plan

Source: `home_localhub/code.html`

Goal
- Implement Home UI matching the reference HTML visuals while keeping UI text and component names in Korean.
- Add a Floating Chat Bot icon (우측 하단) that opens a compact chat window when clicked (no external server; OpenAI calls already covered elsewhere).

Layout & Sections
- Top hero: title, short intro (use `Be Vietnam Pro` for headline, `Noto Sans` for body).
- Right column: `WeatherWidget` (오늘의 날씨) + `RecentPosts` (최근 게시글) + small `RecommendedPlaces` preview.
- Main column: Banner / Highlights / Festival cards / Promotional cards.
- Footer: as in design, include attribution text.

Design Tokens (reuse from DESIGN.md)
- Colors: primary `#00478d`, secondary pale blue `#A5D8FF`, surface `#f8f9fa`.
- Spacing: base 8px, md 24px, gutters 24px.
- Radii: card radius 16px.

Chatbot Floating Behavior
- Place a circular chat button at bottom-right, styled with primary color and white icon.
- Interaction details:
  - Click toggles a compact chat window (card) above the button.
  - Chat window size: ~320x420 (mobile responsive: full-width bottom sheet).
  - Window content: header (title, close button), message list (scrollable), input area with send button.
  - Persist chat history in `localStorage` for the session.
  - Use `VITE_OPENAI_KEY` for API if sending messages (respecting rate/cost constraints).

Accessibility & UX
- Chat window accessible by keyboard (focus trap when open), close on ESC.
- All interactive controls have aria labels.

Implementation Plan (Steps)
1. Create `ChatFloating.vue` component: floating button + small chat window (local state + localStorage history). Make it reusable and mount in `AppLayout`.
2. Integrate `WeatherWidget`, `RecommendedPlaces`, `RecentPosts` into `Home.vue` per design layout.
3. Style using Tailwind utilities and scoped CSS; follow tokens in `design/DESIGN.md`.
4. Add small animation for chat open/close and subtle shadow.
5. Test on mobile: chat window becomes bottom sheet.

Acceptance Criteria
- Home matches reference layout and token rules.
- Floating Chat opens/closes, maintains local history, is keyboard accessible.
- No external public API calls for static content; OpenAI usage controlled by `.env` keys.

Next Action
- I will implement `ChatFloating.vue` and mount it in `AppLayout.vue`, then wire the Home layout if you want me to proceed now.
