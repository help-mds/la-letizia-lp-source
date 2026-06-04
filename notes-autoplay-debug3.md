# Autoplay Debug 3

## Current State
- Space scene is visible with 3 hotspots (Counter Seating, Open Kitchen, Private Room)
- No glow or active popup visible after ~15 seconds
- The hotspots are showing but autoplay is NOT triggering

## Possible Issues
1. The `isTransitioning` state might still be `true` when autoplay checks
2. The `runningSceneRef.current === sceneId` check might be preventing restart
3. The effect dependency `[enabled, isActive, isTransitioning, sceneId]` - when isTransitioning goes from true to false, the effect should re-run and start autoplay

## Key Question
- Is `isTransitioning` actually becoming `false`? The transition takes 1.6s, so after clicking the dot, it should be false after 1.6s.
- But the useEffect cleanup runs when deps change, which clears all timers. Then when isTransitioning becomes false, it re-runs and should start.

## Next Step
- Add console.log directly in the useAutoplay effect to confirm it's being called
