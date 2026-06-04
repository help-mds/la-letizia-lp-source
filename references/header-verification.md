# Header Verification Results

## Hero Mode (scrolled)
- Pill nav (dots): VISIBLE at top center
- RESERVE button: VISIBLE at top right
- Up/Down arrows: VISIBLE at right side
- Share button: VISIBLE at bottom left
- MDS badge: VISIBLE at bottom left

## Scene Mode
- All same elements: VISIBLE

## Conclusion
The header IS persistent and always visible. It works correctly in both hero scroll and scene mode.

The user's complaint "さっき依頼したヘッダーを常に置くのはどこ言ったのよ" might be referring to the PUBLISHED version on their phone where something is different, OR they might be seeing a cached version.

## What to tell the user
The header is already persistent. The issue they're seeing might be on their published version which hasn't been updated yet, or they need to hard-refresh.

Actually wait - looking at the user's first screenshot (CleanShot2026-06-04at14.58.10@2x.webp), it shows the scene mode with the tooltip open. The header (pill nav) IS visible at the top. The arrows ARE visible on the right. So the header IS working.

The user's actual complaints are:
1. "被ってる" - the tooltip is overlapping/covering something (maybe the hotspot button, or maybe the tooltip is too close to the hotspot)
2. "こういう感じバランスとかデザイン" - they want the balance/design like the reference images
3. "ヘッダーを常に置くのはどこ言ったのよ" - they're asking where the persistent header went

Looking at their screenshot again - the header IS there. So maybe they're referring to the fact that in their first screenshot, the tooltip's × button is overlapping with the hotspot button? That's the "被ってる" issue.

Let me look at this differently: in their screenshot, the tooltip × button and the hotspot ? button are at the same visual position. That's the overlap.
