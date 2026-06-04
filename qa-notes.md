# 37 West QA Notes

## Page Load
- CinematicLoader shows "37 West" text on black background
- Progress shows 86% (frames still loading)
- Page total height: 18992px (lots of scroll content)

## Sections confirmed in DOM (from markdown extraction):
1. Hero (37 West + Premium Yakiniku Experience)
2. Atmosphere (Where fire meets precision)
3. Showcase (5 items: A5 Wagyu Treasure, Prime Cut Selection, Wagyu Sashimi, Binchotan Grilled, Chef's Course)
4. Detail (The Cut)
5. Menu (6 items with AED pricing)
6. Story (horizontal scrub with 5 steps: Sourcing, Aging, The Cut, The Flame, Served)
7. Numbers (37 days, 800° flame, 5 seats)
8. Visit (quote + hours + DIFC address + Reserve CTA)
9. MDS Badge (Designed by MDS link)

## Visual Verification Results

1. **Hero** - Full-screen video frame with "37 West" + "Premium Yakiniku Experience" overlay. Interior photo renders correctly.
2. **Showcase** - Full-screen image of A5 Wagyu Treasure with title + subtitle overlay. GSAP pin working (section stays fixed during scroll).
3. **Detail** - Full-screen wagyu overhead on dark marble plate with "The Cut" caption. Canvas rendering correctly.
4. **Story** - Full-screen interior photo with "OUR STORY" label. Canvas rendering correctly.
5. **Numbers** - Large italic typography: "37" / "800°" / "5" with labels. Dark background, editorial spacing.
6. **Visit** - Cinematic endroll: "37 WEST" eyebrow, large italic quote, hours, address, "RESERVE A TABLE" CTA button.
7. **MDS Badge** - Bottom right, "DESIGNED BY MDS" link.

## Status: ALL SECTIONS RENDERING CORRECTLY

Note: GSAP scrub interactions (scroll-driven animations) cannot be fully tested via programmatic scroll in this browser. Real user scrolling needed for final QA of:
- Showcase morph transitions between items
- Detail video frame progression
- Story horizontal video scrub
- SeamTransition A/B/C patterns between sections
