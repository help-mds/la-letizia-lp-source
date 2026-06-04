# 37 West Prototype Test Notes

## First Load (2026-06-04 03:28)
- Page loads at /w/37west
- CinematicLoader shows "37 West" text (working)
- All sections render (confirmed by markdown extraction showing all content)
- Total page height: 18722px (very tall - expected with all pinned sections)
- No TypeScript errors
- All frame URLs loading from /manus-storage/

## Sections confirmed in DOM:
1. Hero (PageScrollScrub) - canvas visible
2. Atmosphere - interior image + "Where fire meets precision"
3. Showcase - all 5 items (wagyu-chest through plated)
4. Detail - canvas + "The Cut" caption
5. Menu - 6 items with prices
6. Story - canvas + 5 steps
7. Numbers - 37 / 800° / 5
8. Visit - quote + hours + address + CTA
9. MDS Badge - bottom right

## Visual Confirmation (scrolling through):
- Hero: Video scrub working, frames rendering on canvas, overlay text "37 West" visible
- Atmosphere: Full-bleed interior image visible (clip-path reveal)
- Showcase: Full-screen wagyu images with "A5 Wagyu Treasure" title, SELECTION label top-left
- Story: Canvas showing interior frames with "OUR STORY" label
- Numbers: Large italic typography "37" / "800°" / "5" with labels, dark background
- Visit: Quote, hours, address, "RESERVE A TABLE" CTA button
- MDS Badge: Bottom right corner

## Known limitations (browser testing):
- GSAP scrub/pin animations can't be fully tested via programmatic scroll (needs real user scroll)
- Showcase morph transitions need real scroll to verify continuous movement
- Story horizontal scrub needs real scroll to verify frame progression
