import { useEffect, useRef, useCallback } from 'react';

/**
 * useSceneScroll — converts wheel/touch-swipe into scene navigation.
 *
 * While in scene mode (viewport locked), wheel-down or swipe-down = next scene,
 * wheel-up or swipe-up = previous scene.
 *
 * Debounced to prevent rapid-fire navigation.
 */

interface UseSceneScrollOptions {
  /** Whether scene mode is active (viewport locked) */
  enabled: boolean;
  /** Whether a transition is currently playing */
  isTransitioning: boolean;
  /** Navigate to next/prev scene */
  onNext: () => void;
  onPrev: () => void;
  /** Called when user scrolls (for autoplay interrupt) */
  onUserScroll?: () => void;
}

export function useSceneScroll({
  enabled,
  isTransitioning,
  onNext,
  onPrev,
  onUserScroll,
}: UseSceneScrollOptions) {
  const lastNavTimeRef = useRef(0);
  const touchStartRef = useRef<{ y: number; time: number } | null>(null);
  const accumulatedDeltaRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce threshold — minimum time between scene changes
  const NAV_COOLDOWN = 1800; // ms (transition takes ~1.6s)
  // Wheel accumulation threshold
  const WHEEL_THRESHOLD = 80;
  // Touch swipe minimum distance
  const TOUCH_MIN_DISTANCE = 40;

  const canNavigate = useCallback(() => {
    if (isTransitioning) return false;
    const now = Date.now();
    if (now - lastNavTimeRef.current < NAV_COOLDOWN) return false;
    return true;
  }, [isTransitioning]);

  const doNavigate = useCallback((direction: 'next' | 'prev') => {
    if (!canNavigate()) return;
    lastNavTimeRef.current = Date.now();
    accumulatedDeltaRef.current = 0;
    onUserScroll?.();
    if (direction === 'next') onNext();
    else onPrev();
  }, [canNavigate, onNext, onPrev, onUserScroll]);

  // Wheel handler
  useEffect(() => {
    if (!enabled) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Accumulate delta for smooth trackpad support
      accumulatedDeltaRef.current += e.deltaY;

      // Reset accumulator after inactivity
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        accumulatedDeltaRef.current = 0;
      }, 200);

      if (Math.abs(accumulatedDeltaRef.current) >= WHEEL_THRESHOLD) {
        if (accumulatedDeltaRef.current > 0) {
          doNavigate('next');
        } else {
          doNavigate('prev');
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [enabled, doNavigate]);

  // Touch handler (vertical swipe only)
  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { y: touch.clientY, time: Date.now() };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dy = touch.clientY - touchStartRef.current.y;
      const dt = Date.now() - touchStartRef.current.time;
      touchStartRef.current = null;

      // Only respond to quick vertical swipes
      if (dt > 600) return;
      if (Math.abs(dy) < TOUCH_MIN_DISTANCE) return;

      if (dy < 0) {
        // Swipe up = next scene
        doNavigate('next');
      } else {
        // Swipe down = prev scene
        doNavigate('prev');
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, doNavigate]);
}
