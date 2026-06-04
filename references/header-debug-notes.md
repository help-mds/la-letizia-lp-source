# Header Persistence Debug Notes

## Structure
- InteractiveLpPage.tsx lines 421-448: SceneNavigation is in a `fixed top-0 left-0 right-0 z-[200]` wrapper
- This wrapper is OUTSIDE both the hero `!sceneMode && <PageScrollScrub>` block and the scene mode block
- So it should ALWAYS be visible

## CSS
- All nav elements use `position: fixed` with `z-index: 60`
- The wrapper in JSX has `z-[200]` which should be above everything

## Problem
- User says header is "被ってる" (overlapping/hidden)
- Looking at the screenshot, the header IS visible but the issue is about the TOOLTIP overlapping with the hotspot buttons
- The user's first complaint was "被ってるってば" referring to the tooltip overlapping with the hotspot

## Actual Issue
The user is saying the TOOLTIP is overlapping/covering the hotspot buttons. They want:
1. Tooltip positioned so it doesn't cover other hotspots (like the reference image)
2. The reference shows tooltip positioned clearly beside the hotspot with no overlap

## About "ヘッダーを常に置く"
The user is reminding that the header should ALWAYS be visible - from the very first moment of the hero scroll all the way through scenes. Looking at the code, it IS always rendered. The issue might be that during hero scroll, the header is not visible because of z-index or opacity issues with PageScrollScrub's sticky canvas.
