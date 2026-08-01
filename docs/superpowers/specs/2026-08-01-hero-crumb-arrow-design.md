# Hero: responsive crumb-trail caption + pointer arrow

## Context

In [Hero.tsx](../../../components/sections/Hero.tsx), the "Come To Us" button sits inside a `relative` wrapper ([Hero.tsx:24](../../../components/sections/Hero.tsx#L24)) alongside a decorative crumb-trail image and a caption:

> "follow the cookie crumbs trail to Papova ul. 2"

The caption currently only has two horizontal positions (a base value and one `sm` override via `translate-x`). It should keep drifting further right as the viewport widens, and needs a hand-drawn curved arrow to its left, pointing back up at the "Come To Us" button.

## Changes

### 1. Caption keeps drifting right at larger breakpoints

Extend the caption `<p>`'s `-translate-x-[8%] sm:translate-x-[10%]` with additional `md:`/`lg:`/`xl:` values that push it progressively further right, following the same incremental pattern already established between the base and `sm` values. No JS — pure Tailwind responsive utility classes, consistent with how the rest of the file (crumb image, caption margin-top) already scales per breakpoint.

### 2. Hand-drawn curved arrow pointing at the button

A new inline SVG, placed as a sibling of the caption `<p>` inside the same `relative` wrapper:

- **Style**: single hand-drawn-looking stroke (slightly irregular curve, not a perfect arc) with a small arrowhead, done as an inline `<svg>` with a `<path>` — no external asset.
- **Color**: `text-cream/90` (via `stroke="currentColor"`), matching the caption's existing tone.
- **Placement**: positioned absolutely to the left of the caption text, curving upward toward the button.
- **Responsiveness**: since the caption's horizontal offset grows at each breakpoint, the arrow gets its own small set of `sm:`/`md:`/`lg:`/`xl:` position (and light rotation, if needed) adjustments so it stays visually connecting the button to the caption's left edge at every breakpoint, mirroring the technique already used for the crumb image's own responsive offsets ([Hero.tsx:37](../../../components/sections/Hero.tsx#L37)).
- This is a decorative pointer, not a pixel-precise measurement — breakpoint-tuned CSS positioning is sufficient, no runtime layout measurement/JS needed.

## Out of scope

- No JS-driven dynamic measurement between the two elements — purely responsive CSS breakpoints, matching the rest of the component.
- No changes to the crumb-trail image or the "Order Now!" button.

## Verification

- Visually check the hero at each Tailwind breakpoint (base, sm, md, lg, xl) in a running dev server: caption continues drifting right, arrow stays visually connecting the button to the caption.
