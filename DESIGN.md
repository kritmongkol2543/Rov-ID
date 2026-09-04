# RIFT ID Design System — Engineering Editorial v2

## Direction
The storefront should feel like a precise game inventory catalog, not a generic AI-generated SaaS landing page. Visual hierarchy comes from typography, information density, imagery/data, rules, and contrast — not gradients, glow, glass, or decorative cards.

## Core tokens
- Accent: #76B900. One accent only for primary CTA, active state, focus, and 12px corner marker.
- Canvas: #FDFDFC.
- Soft surface: #F5F5F3.
- Dark chapters: #0B0B0B / #191919.
- Hairline: #D2D2CF (light), #454545 (dark).
- Radius: 2px for cards, inputs, controls, and buttons.
- Type: Inter + Noto Sans Thai. Weight 400/700/800 only.
- Base spacing unit: 8px. Major section rhythm: 64px desktop / 48px tablet / 32–40px mobile.

## Banned slop patterns
- Gradient text.
- Decorative glow / colored shadow halo.
- Glassmorphism and decorative backdrop blur.
- Pill buttons and pill badges.
- 12px+ card radius.
- Identical icon + heading + text feature grids.
- Cards nested inside cards.
- Oversized hero metric template.
- Modal-first UX for product detail, auth, or checkout; use side drawer/progressive disclosure.
- Multiple accent colors.

## Components
- Primary button: 44px, green fill, 2px radius, bold.
- Secondary button: transparent, 1px border, 2px radius.
- Product card: white, 1px hairline, 2px radius, 12px green corner square, dark 16:10 cover, structured spec row.
- Product detail: right side drawer.
- Flow Lab: dark full-width chapter; two 2-option segmented controls.
- Trust: table-like 4-column structure, not icon cards.
- Footer: black, dense link columns.

## Responsive
- >1080: 3-up product grid, visible filter rail.
- <=1080: 2-up grid.
- <=820: filter rail collapses behind a button.
- <=560: single-column product grid, hero stack, full-width drawer.

## Quality gate
Before shipping, check for: low contrast, body lines >80ch, touch targets <44px, skipped heading levels, accidental extra accent colors, large radius, glow, glass, gradient text, and repeated equal-weight card grids.
