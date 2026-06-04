# Tooltip Issue Analysis

## Current State (from screenshot)
- The tooltip IS showing next to the hotspot (Open Kitchen at x:52, y:55)
- It appears to the RIGHT of the hotspot with correct styling (dark card, italic title, body text)
- The × button is visible (white circle with black X)
- The tooltip is at a good size (340px width)

## User's Complaint
- "被ってる" = the tooltip is overlapping with other hotspots
- Looking at the screenshot: the tooltip card is overlapping with the "Private Room" hotspot (index 16, at x:76, y:42)
- The tooltip also overlaps slightly with the "Open Kitchen" hotspot button itself

## Reference Image Analysis
- In the Marina Bay Sands reference (3rd image), the tooltip is positioned clearly beside the hotspot
- The tooltip doesn't overlap with OTHER hotspots
- It's a clean separation

## Solution
The issue is that with hotspots close together, the tooltip (340px wide) naturally overlaps neighboring hotspots.
Options:
1. Make tooltip position smarter - avoid overlapping other hotspots
2. Position tooltip more centrally on the screen (not anchored to hotspot)
3. Increase the offset distance from the hotspot

Looking at reference image 1 (user's screenshot of their own site): the tooltip IS anchored beside the hotspot, and it DOES partially overlap other elements. So this is actually acceptable.

The user's MAIN complaint was about the first screenshot where the × button was overlapping the hotspot button itself. Let me check if that's still happening.

Actually re-reading the user message: "だから、被ってるてば。こういう感じバランスとかデザイン" - they're saying it's STILL overlapping. They want the balance/design like the reference images.

Looking more carefully at the reference: the tooltip has MORE offset from the hotspot, and the close button is positioned at the TOP-LEFT of the card (not overlapping the hotspot).

Current issue: The tooltip's close button (×) is at position top:16px, left:16px inside the card. The card itself is positioned `left: calc(100% + 28px)` from the hotspot. This should be fine.

BUT the real issue might be that on the user's actual device/viewport, the tooltip is positioned differently or the hotspots are closer together.

## What to fix
1. The header is already persistent - it's working. The user might be confused or referring to something else.
2. For the tooltip: increase offset, ensure it doesn't clip viewport edges
