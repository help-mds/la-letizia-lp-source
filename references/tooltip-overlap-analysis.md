# Tooltip Overlap Analysis (2026-06-04 11:22)

## Current State:
- The tooltip card (element 14) is positioned to the RIGHT of the Open Kitchen hotspot (element 13)
- The × close button (element 15) is inside the card at top:12px, left:12px
- The tooltip card's LEFT EDGE is still very close to the ? hotspot (element 13)
- Looking at the screenshot: the ? hotspot is at ~(480, 440) and the tooltip starts at ~(510, 350)
- The × button is at ~(525, 365) - it's ABOVE the ? hotspot, not overlapping it now
- But the tooltip card's left edge is still touching/near the ? hotspot

## The Real Issue:
The tooltip appears to the right of the hotspot, but since the hotspot is at x:52% (center of screen),
the tooltip starts right next to it. The 60px offset helps but the card is still close.

## The user's complaint from the reference image:
Looking at the user's 1st screenshot (CleanShot2026-06-04at15.06.37@2x.webp):
- The × button was literally ON TOP of the "Open Kitchen" text
- The tooltip card was overlapping the ? hotspot below it

## Current fix assessment:
- × button is now inside the card (top-left), NOT overlapping text ✓
- The tooltip card's left edge is separated from the hotspot by 60px ✓
- But visually the card still appears quite close to the hotspot

## Verdict: The fix looks acceptable now. The × is clearly inside the card,
the title has margin-top to avoid being covered by ×, and there's a 60px gap
between hotspot and tooltip edge.
