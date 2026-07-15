---
name: Marine Modern
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#424752'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#727783'
  outline-variant: '#c2c6d4'
  surface-tint: '#005db6'
  primary: '#00478d'
  on-primary: '#ffffff'
  primary-container: '#005eb8'
  on-primary-container: '#c8daff'
  inverse-primary: '#a9c7ff'
  secondary: '#2e6385'
  on-secondary: '#ffffff'
  secondary-container: '#a5d8ff'
  on-secondary-container: '#285f80'
  tertiary: '#504629'
  on-tertiary: '#ffffff'
  tertiary-container: '#695e3f'
  on-tertiary-container: '#e8d8b1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#00468c'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#9accf3'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#0c4b6c'
  tertiary-fixed: '#f1e1b9'
  tertiary-fixed-dim: '#d4c59f'
  on-tertiary-fixed: '#221b03'
  on-tertiary-fixed-variant: '#504629'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

This design system is built for a vibrant coastal community, capturing the refreshing energy of Busan through a lens of modern utility. The brand personality is **refreshing, reliable, and deeply local**, acting as a digital town square that feels as open and inviting as the shoreline.

The design style is **Corporate / Modern** with a **Tactile** edge. It prioritizes clarity and information density while using soft shadows and seagull motifs to prevent a sterile "enterprise" feel. The aesthetic leverages high whitespace and a systematic approach to typography to ensure accessibility for a wide demographic of local residents and visitors.

## Colors

The palette is derived from the natural landscape of Busan. The **Primary Blue (#005EB8)** represents the deep sea and provides the necessary contrast for interactive elements and brand reliability. The **Secondary Pale Blue (#A5D8FF)** acts as a supporting "sky" tone for backgrounds and highlights. 

The **Tertiary Sandy Neutral (#F4E4BC)** is used sparingly for warmth in community-driven content or secondary accents. Surfaces are predominantly **Crisp White (#FFFFFF)** or **Soft Neutral (#F8F9FA)** to maintain a clean, airy feel that mimics the bright coastal light. Success, warning, and error states should utilize standard semantic tones but desaturated to match the softness of the primary palette.

## Typography

The typography system utilizes **Be Vietnam Pro** for headings to provide a contemporary, friendly geometric touch that pairs excellently with iconography. For body text and system UI, **Noto Sans** is selected for its exceptional multi-script support, specifically its high legibility for Korean characters (Hangul).

Hierarchy is established through weight and scale. Large display titles should use tighter letter spacing to feel impactful, while body text requires generous line-height (1.6) to ensure comfort during long-form community updates or news reading.

## Layout & Spacing

The design system employs a **Fluid Grid** with a 12-column structure for desktop and a 4-column structure for mobile. A strict 8px spacing scale governs all padding and margins to maintain rhythmic consistency.

- **Desktop (1280px+):** 12 columns, 24px gutters, 40px+ side margins.
- **Tablet (768px - 1279px):** 8 columns, 20px gutters, 24px side margins.
- **Mobile (<767px):** 4 columns, 16px gutters, 16px side margins.

Content blocks should use "Airy" padding (24px or 32px internal padding for cards) to emphasize the coastal, uncrowded feeling of the brand.

## Elevation & Depth

This design system uses **Ambient Shadows** to create a sense of soft, natural depth. Surfaces are not flat, but subtly "floating" above the sandy neutral background.

- **Level 1 (Default Cards):** Low-opacity (#000000 at 4%), 8px blur, 2px Y-offset.
- **Level 2 (Hover/Active):** Slightly more defined shadow (#000000 at 8%), 16px blur, 4px Y-offset.
- **Level 3 (Modals/Popovers):** Deep, diffused shadow (#000000 at 12%), 32px blur, 12px Y-offset.

To reinforce the coastal theme, elevation is often complemented by a subtle 1px stroke in a slightly darker version of the surface color to ensure crispness against the pale background.

## Shapes

The shape language is **Rounded**, reflecting the soft curves of waves and the friendly nature of the community. 

- **Small elements (Buttons, Inputs):** 0.5rem (8px).
- **Medium elements (Cards, Modals):** 1rem (16px).
- **Large elements (Banners, Sections):** 1.5rem (24px).

Seagull motifs should be integrated into the UI as organic, floating icons or as subtle watermark patterns in the corners of sections. Use rounded terminals for all custom icons and illustrations to match the primary UI radius.

## Components

### Buttons
Primary buttons use the deep sea blue (#005EB8) with white text. Secondary buttons use a ghost style with a 1px primary-colored border. All buttons utilize the `rounded-md` (8px) corner radius.

### Input Fields
Inputs feature a subtle `#F1F3F5` background with no border in their rest state, moving to a 2px primary blue border on focus. Label text remains in `label-md` weight above the field.

### Cards
Community cards (for events or news) are the primary vehicle for content. They use a white background, Level 1 elevation, and a 16px corner radius. Images within cards should always be clipped to the top 16px radius.

### Chips & Tags
Used for categories like "District," "Event," or "Market." These use a pill-shape (fully rounded) and the secondary pale blue (#A5D8FF) with dark navy text.

### Lists
List items are separated by a soft 1px horizontal line in the neutral tone (#E9ECEF). Each item has a generous 16px vertical padding to maintain the "airy" aesthetic.

### Additional Components: "Local Indicator"
A custom badge component featuring the minimalist seagull icon used to highlight verified local businesses or government announcements. This uses the Tertiary Sandy color to draw attention without being aggressive.