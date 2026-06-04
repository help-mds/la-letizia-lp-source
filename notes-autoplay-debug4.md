# Autoplay Debug 4 - Key Finding

## The autoplay IS starting correctly
The logs clearly show:
- `[Autoplay] Starting sequence for: s1` at 15:03:45
- The old logs showed `[Autoplay] Showing first popup` 1 second after starting

## The problem is NOT in useAutoplay timing
The sequence starts, but the DOM doesn't reflect the state changes.

## Root Cause Hypothesis
The `runSequence` callback is captured via `useCallback` with NO dependencies (empty deps).
But it uses `hotspotIdsRef.current` and calls `setActivePopupId` / `setGlowingHotspotId`.

Wait - `setActivePopupId` and `setGlowingHotspotId` are React state setters, they are stable.
And `hotspotIdsRef.current` is a ref, so it should have the latest value.

## NEW HYPOTHESIS
The issue is that `runSequence` uses `addTimer` which is also a `useCallback`.
`addTimer` pushes to `timersRef.current` - this should work fine.

## ACTUAL PROBLEM
Looking at the cleanup:
```
return () => {
  clearAllTimers();
  graceRef.current = false;
};
```

When `isTransitioning` changes from `true` to `false`, the effect RE-RUNS.
But the cleanup from the PREVIOUS run (when isTransitioning was true) doesn't exist 
because we returned early (`if (!enabled || !isActive || isTransitioning) return;`).

Wait no - when isTransitioning was true, we returned early WITHOUT a cleanup function.
Then when isTransitioning becomes false, the effect runs again, starts the sequence, 
and returns a cleanup function.

So the sequence SHOULD be running. Let me check if the state updates are reaching InteractiveScene.

## REAL ISSUE
The `useAutoplay` hook is called in InteractiveLpPage. It sets `activePopupId` state.
This state is then passed to InteractiveScene as `autoplayPopupId`.

BUT - the InteractiveScene component uses `const activePopup = manualPopup || autoplayPopupId || null;`

If `manualPopup` is not null, it takes priority. But on fresh load, manualPopup should be null.

## WAIT - Check the effect cleanup issue
When the effect runs with `isTransitioning = false`, it calls `runSequence()`.
`runSequence` sets up timers. The first timer fires after 1000ms (glow).
But if the component re-renders for any reason and the effect deps change,
the cleanup will `clearAllTimers()`.

The deps are: `[enabled, isActive, isTransitioning, sceneId]`
After starting, if NONE of these change, the cleanup won't fire.
But `hotspotIds` is NOT in the deps, so if hotspotIds changes (e.g. due to isMobile change), 
the effect won't re-run and won't clear timers.

## CONCLUSION
The autoplay IS running. The timers ARE firing. But the STATE UPDATES are not 
causing a re-render that reaches the DOM.

This could be because the component tree is structured such that the state lives in 
useAutoplay (inside InteractiveLpPage) but the InteractiveScene is rendered conditionally
and might not be receiving the updated props.

Let me check: in the render, `autoplayPopupId` is passed only when 
`isActive && scene.id === currentSceneId`. Since currentSceneId is 's1' and the scene 
being rendered is 's1', this should work.
