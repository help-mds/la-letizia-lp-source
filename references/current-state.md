# Current State Observations (2026-06-04)

## What's Working:
1. Top header bar visible: "LA LETIZIA" left, "CREATED BY MDS" right (green link)
2. Pill dot nav with circles (not text labels) - centered below header
3. RESERVE button top-right with beige/gold glass style
4. Up/down arrows right side
5. Share button bottom-left
6. Scene image fills full viewport (desktop)

## Issues to Fix:
1. Tooltip × button (element 15) is STILL overlapping with the ? hotspot (element 13)
   - The × button appears at the top-left of the tooltip card, but the card itself starts right next to the hotspot
   - Need more offset OR move × button to a position that doesn't overlap the hotspot
   - Looking at the screenshot: the × is at position ~(500, 360) and the ? hotspot is at ~(480, 440)
   - They're close but not directly overlapping now - the × is above-left of the hotspot
   - Actually the issue is the TOOLTIP CARD itself overlaps the hotspot below it

2. The tooltip card (element 14) overlaps with the ? hotspot (element 13)
   - The tooltip appears to the right of the hotspot, but the card starts at the same vertical level
   - Since the hotspot is at x:52, y:55 and the tooltip appears to its right, the card's left edge is close to the hotspot

## Solution:
- Increase the left offset of .hotspot-tooltip--right from 44px to 60px+
- Move the × button from top:-12px, left:-12px to top:12px, left:12px (INSIDE card, top-left corner)
  OR keep it outside but ensure it doesn't overlap by using top:-14px, left:14px
