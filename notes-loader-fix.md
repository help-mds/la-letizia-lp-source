# Loader/Hero Overlap Fix Verification

## First screenshot (5:04:24)
- Dark background with "La Le" visible mid-stagger animation
- NO Hero text visible behind the loader
- The loader is correctly hiding the overlay children (opacity: 0)

## Second screenshot (5:04:34)
- Loader has completed and exited
- Hero is now visible: "Marina Daylight, Slow Coffee" with marble counter background
- Only ONE layer of text visible — no double/overlap
- The fix is working correctly

## Root Cause
The CinematicLoader (z-index: 99999) was a fixed overlay, but the Hero overlay children
were positioned absolutely within the scroll container at z-index: 2. Since the loader
used a solid dark background, the Hero text was technically rendered behind it but could
show through during the loader's exit animation (yPercent: -100 slide up).

## Fix Applied
Added `loaderActive` prop to PageScrollScrub. When true, overlay children are rendered
with opacity: 0 (invisible). When the loader completes and sets loaderDismissed=true,
loaderActive becomes false and children fade in with a 0.3s transition.
