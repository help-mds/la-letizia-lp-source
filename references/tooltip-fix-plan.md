# Tooltip Fix Plan

## Current State
Looking at the screenshots:
- Private Room (x:76, y:42): tooltip shows to the LEFT (correct, since x > 60)
- The × close button overlaps with the hotspot button itself (they're at the same position)
- The tooltip card's top-left corner is right where the hotspot button is

## The Problem
The tooltip is anchored at `top: 50%; transform: translateY(-50%)` relative to the hotspot.
The close button is at `top: 16px; left: 16px` inside the card.
When the tooltip appears to the LEFT, the right edge of the tooltip is at `right: calc(100% + 28px)`.
This means the close button (at the left side of the card) is far from the hotspot.

BUT looking at the screenshot more carefully:
- The × button IS at the top-left of the tooltip card
- The hotspot button (?) is visible to the right of the tooltip
- They're NOT overlapping in a problematic way

## What the user actually wants
Re-reading: "だから、被ってるてば" + "こういう感じバランスとかデザイン" + reference images

The user wants:
1. The tooltip to look like the Marina Bay Sands reference - which it now does (dark card, italic title, body text)
2. The BALANCE to be like the reference - meaning the tooltip should be well-positioned and not feel cramped

And separately: "あと、さっき依頼したヘッダーを常に置くのはどこ言ったのよ"
= "Also, where did the header-always-visible thing I asked for go?"

This means the user is seeing the header disappear at some point. Let me check if during hero scroll the header might be hidden behind the sticky canvas.

## Root Cause for Header
The PageScrollScrub has a `sticky top-0` div that creates a stacking context.
The persistent header wrapper is `fixed z-[200]` which should be above everything.
BUT - the sticky element might create a new stacking context that competes.

Actually, looking at the JSX structure:
```
<div ref={containerRef} className="relative bg-black text-white">
  <!-- PERSISTENT HEADER (fixed z-[200]) -->
  <div className="fixed top-0 left-0 right-0 z-[200]">
    <SceneNavigation />
  </div>
  
  <!-- HERO MODE -->
  {!sceneMode && <PageScrollScrub>...</PageScrollScrub>}
  
  <!-- SCENE MODE -->
  {sceneMode && ...}
</div>
```

The fixed header is INSIDE a `relative` container. Fixed positioning should still work regardless of parent, but z-index stacking contexts can be tricky.

The PageScrollScrub's sticky div doesn't have an explicit z-index, so it shouldn't override the fixed z-[200] header.

WAIT - I think the issue is that the user is looking at the PUBLISHED version on their phone, and the header might not be showing during the initial hero scroll animation. Let me verify by navigating to the hero state.
