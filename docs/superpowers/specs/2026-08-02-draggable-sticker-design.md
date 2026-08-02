# Draggable 3D "Best Seller" Sticker — Design

## Context

`MenuCarousel.tsx` shows a "BEST SELLER" badge over the featured cookie
([MenuCarousel.tsx:54-58](../../../components/sections/MenuCarousel.tsx)) — a
static rotated circle. The goal is to make it feel like a physical sticker
you can drag/peel, following the interaction pattern from Framer
University's ["3D Sticker Drag" component](https://framer.university/resources/3d-sticker-drag-component-in-framer):
tilt-on-drag, elevate + scale, a deepening shadow, and a subtle sheen/light
sweep, all springing back to rest on release.

This project (Next.js + React) has no code equivalent of that Framer
component, so it's implemented from scratch with the `motion` package
(framer-motion) rather than the no-code Framer tool.

## Scope

- Full effect: tilt, elevate, shadow, sheen — all four, per user's choice.
- Release behavior: snap back to the original resting position (elastic
  spring), not "stay where dropped."
- Applies to the one existing "BEST SELLER" badge only. No other stickers
  exist in the codebase today.

## Component: `components/ui/DraggableSticker.tsx`

A client component (`"use client"`) that wraps arbitrary children (the
existing badge markup) and owns all drag/tilt/elevate/sheen/shadow logic.
`MenuCarousel.tsx` keeps the badge's visual styling (shape, colors, text);
`DraggableSticker` only adds behavior and a couple of presentational layers
(shadow, sheen overlay) around it.

```tsx
<DraggableSticker className="absolute top-[30%] left-[14%] h-[11%] w-[11%]">
  <div className="flex h-full w-full -rotate-12 items-center justify-center
                   rounded-full bg-cream text-center text-[8px] font-bold
                   uppercase shadow-md sm:text-[10px] md:text-xs lg:text-sm">
    {slide.badge}
  </div>
</DraggableSticker>
```

`className` positions the wrapper (absolute placement/sizing currently on
the badge div moves here); the inner div keeps its own rotation/shape/text
styling untouched.

### Props

- `children: ReactNode` — the sticker's visual content.
- `className?: string` — positioning/sizing classes for the wrapper.

No further configuration props (tilt sensitivity, elevation amount, etc.) —
YAGNI, since there's exactly one call site today. Constants live as local
consts inside the component, easy to promote to props later if a second
sticker shows up.

## Interaction mechanics

- **Perspective**: the wrapper renders with `style={{ perspective: 800 }}`
  so child `rotateX`/`rotateY` transforms read as real 3D tilt.
- **Tilt**: `onDrag` computes the pointer's offset from the sticker's own
  center, maps it to a `rotateX`/`rotateY` target (clamped to ±14°), and
  feeds it through `useSpring` (stiffness ~150, damping ~15) for smoothing.
  Dragging right tilts the far edge away, like peeling a corner.
- **Elevate**: on drag start, scale animates from `1` to `~1.15` and a
  small `z` lift is applied; springs back to `1` on release.
- **Shadow**: a `useMotionValue`-driven `boxShadow` — tight/soft at rest,
  larger/softer/more offset while dragging — to sell the lift.
- **Sheen**: an absolutely-positioned gradient overlay inside the sticker
  (`mix-blend-mode: overlay`), angle tied to the live `rotateY` value,
  opacity fading in only while dragging (0 at rest) — a light sweep, not a
  permanent holographic look.
- **Release**: `dragSnapToOrigin` (built-in `motion` prop) springs the
  sticker's position back to its resting spot automatically. Tilt, scale,
  shadow, and sheen opacity animate back to their rest values in parallel
  (driven by the same drag-active state).
- **Touch**: handled natively by `motion`'s pointer/gesture system;
  `touchAction: "none"` on the draggable element prevents page scroll from
  hijacking the gesture on mobile.

## Integration changes

- `package.json`: add `motion` as a dependency (`npm install motion`).
- `components/sections/MenuCarousel.tsx`: wrap the existing badge div in
  `<DraggableSticker>` as shown above. The tray's outer container is
  `pointer-events-none` (badge currently inherits that); the wrapper needs
  `pointer-events-auto` so it's actually draggable, matching the existing
  prev/next buttons' pattern.

## Testing / verification

No automated test framework exists in this project for interaction/motion
behavior, and drag physics are inherently visual — verification is manual:

1. `npm run dev`, open the page with the menu carousel.
2. Drag the sticker with a mouse: confirm it tilts opposite the drag
   direction, lifts/scales up, shadow deepens, a sheen sweep is visible,
   and it springs back cleanly to its original spot on release.
3. Check a touch-emulated viewport (browser devtools device toolbar):
   confirm touch-drag works and doesn't scroll the page.
4. Confirm the rest of the carousel (prev/next buttons, badge text/shape)
   is unaffected.
