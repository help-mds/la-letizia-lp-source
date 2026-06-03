# Bridge Transition Fix - RESOLVED

## Final result
The transition now works perfectly:
1. The scroll scrub video's last frame (booth/table with dark floor) flows naturally into...
2. A pure dark (#0E0D0C) bridge with "DISCOVER" text centered (subtle, cinematic breathing room)
3. The AtmosphereSection's latte art image materializes FROM the darkness with a smooth gradient

The dark-to-dark approach eliminates the ugly white band completely. The image emerges from darkness like a cinematic reveal. No visible seam, no jarring color shift. This is the premium approach used by high-end agency sites.

## Changes made
- RestaurantMenuFadeIn: Changed from white-ending gradient to pure dark (#0E0D0C) background
- AtmosphereSection: Changed top mask from white (var(--bg)) to dark (#0E0D0C), creating a dark-to-image reveal
- AtmosphereSection: Uses -15vh negative margin to overlap the bridge for seamless blending
