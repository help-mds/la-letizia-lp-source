import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useAutoplay — manages automatic sequential popup display for a scene.
 *
 * Flow per scene:
 *   Scene arrives → transition ends → 1s delay → popup[0] glow + show → displayTime → hide → 0.5s → popup[1] → ...
 *
 * Respects:
 *   - playedScenes: won't replay if scene was already played
 *   - user interrupt: if user taps ? or × or navigates away, autoplay stops
 *   - text length determines display time
 */

interface AutoplayOptions {
  /** Hotspot IDs in order for this scene */
  hotspotIds: string[];
  /** Hotspot body texts (for calculating display time) */
  hotspotBodies: string[];
  /** Whether this scene is currently active */
  isActive: boolean;
  /** Scene ID for tracking played state */
  sceneId: string;
  /** Whether transition animation is still playing */
  isTransitioning: boolean;
  /** Whether autoplay is enabled for this scene */
  enabled: boolean;
}

interface AutoplayState {
  /** Currently auto-displayed popup ID (null = none) */
  activePopupId: string | null;
  /** Currently glowing hotspot ID (null = none) */
  glowingHotspotId: string | null;
  /** Whether autoplay is currently running */
  isAutoplaying: boolean;
  /** Interrupt autoplay (called on user interaction) */
  interrupt: () => void;
  /** Set of played scene IDs */
  playedScenes: Set<string>;
}

/**
 * Calculate display time based on text length.
 * Short (<50 chars): 3s
 * Medium (50-100 chars): 3.5s
 * Long (>100 chars): 4.5s
 */
function getDisplayTime(text: string): number {
  const len = text.length;
  if (len < 50) return 3000;
  if (len <= 100) return 3500;
  return 4500;
}

export function useAutoplay({
  hotspotIds,
  hotspotBodies,
  isActive,
  sceneId,
  isTransitioning,
  enabled,
}: AutoplayOptions): AutoplayState {
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const [glowingHotspotId, setGlowingHotspotId] = useState<string | null>(null);
  const [isAutoplaying, setIsAutoplaying] = useState(false);
  const playedScenesRef = useRef<Set<string>>(new Set());

  // Refs for stable access
  const interruptedRef = useRef(false);
  const graceRef = useRef(false);
  const runningSceneRef = useRef<string | null>(null);
  const sequenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepIndexRef = useRef(0);

  // Store latest values in refs for use in callbacks
  const hotspotIdsRef = useRef(hotspotIds);
  hotspotIdsRef.current = hotspotIds;
  const hotspotBodiesRef = useRef(hotspotBodies);
  hotspotBodiesRef.current = hotspotBodies;
  const isTransitioningRef = useRef(isTransitioning);
  isTransitioningRef.current = isTransitioning;

  // Cancel current timer
  const cancelTimer = useCallback(() => {
    if (sequenceTimerRef.current !== null) {
      clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = null;
    }
  }, []);

  // Schedule next step
  const scheduleStep = useCallback((fn: () => void, delay: number) => {
    cancelTimer();
    sequenceTimerRef.current = setTimeout(fn, delay);
  }, [cancelTimer]);

  // Interrupt autoplay (user action)
  const interrupt = useCallback(() => {
    if (graceRef.current) return;
    interruptedRef.current = true;
    cancelTimer();
    setIsAutoplaying(false);
    setGlowingHotspotId(null);
    runningSceneRef.current = null;
  }, [cancelTimer]);

  // The step-by-step sequence runner (recursive setTimeout chain)
  const runStep = useCallback((step: number, ids: string[], bodies: string[], sid: string) => {
    if (interruptedRef.current) return;

    const totalSteps = ids.length * 3; // (glow + show + hide) per hotspot

    if (step >= totalSteps) {
      // All done
      setIsAutoplaying(false);
      setActivePopupId(null);
      setGlowingHotspotId(null);
      playedScenesRef.current.add(sid);
      runningSceneRef.current = null;
      graceRef.current = false;
      // Sequence complete
      return;
    }

    const hotspotIndex = Math.floor(step / 3);
    const phase = step % 3; // 0=glow, 1=show, 2=hide

    if (hotspotIndex >= ids.length) {
      // Safety: shouldn't happen but just in case
      setIsAutoplaying(false);
      runningSceneRef.current = null;
      return;
    }

    const hotspotId = ids[hotspotIndex];
    const body = bodies[hotspotIndex] || '';
    const displayTime = getDisplayTime(body);

    if (phase === 0) {
      // Glow phase
      setGlowingHotspotId(hotspotId);
      setActivePopupId(null);
      // After 500ms, show popup
      scheduleStep(() => runStep(step + 1, ids, bodies, sid), 500);
    } else if (phase === 1) {
      // Show phase
      setActivePopupId(hotspotId);
      setGlowingHotspotId(null);
      // After displayTime, hide popup
      scheduleStep(() => runStep(step + 1, ids, bodies, sid), displayTime);
    } else {
      // Hide phase
      setActivePopupId(null);
      // After 500ms gap, start next hotspot (or finish)
      scheduleStep(() => runStep(step + 1, ids, bodies, sid), 500);
    }
  }, [scheduleStep]);

  // Start the autoplay sequence
  const startSequence = useCallback((ids: string[], bodies: string[], sid: string) => {
    // Starting sequence
    interruptedRef.current = false;
    graceRef.current = true;
    setIsAutoplaying(true);
    runningSceneRef.current = sid;
    stepIndexRef.current = 0;

    // Grace period ends after 1.5s
    setTimeout(() => { graceRef.current = false; }, 1500);

    // Initial delay of 1s before first glow
    scheduleStep(() => runStep(0, ids, bodies, sid), 1000);
  }, [scheduleStep, runStep]);

  // Reset interruptedRef when scene changes so new scenes can autoplay
  const prevSceneIdRef = useRef(sceneId);
  useEffect(() => {
    if (prevSceneIdRef.current !== sceneId) {
      prevSceneIdRef.current = sceneId;
      // New scene: allow autoplay to start fresh
      interruptedRef.current = false;
    }
  }, [sceneId]);

  // Main effect: watch for conditions to start autoplay
  // Uses a polling approach to avoid cleanup issues with isTransitioning in deps
  useEffect(() => {
    if (!enabled || !isActive) {
      // Reset if scene becomes inactive
      if (runningSceneRef.current) {
        cancelTimer();
        setIsAutoplaying(false);
        setActivePopupId(null);
        setGlowingHotspotId(null);
        interruptedRef.current = true;
        runningSceneRef.current = null;
      }
      return;
    }

    // Already running or played
    if (runningSceneRef.current === sceneId) return;
    if (playedScenesRef.current.has(sceneId)) return;

    const ids = hotspotIdsRef.current;
    const bodies = hotspotBodiesRef.current;
    if (ids.length === 0) return;

    // Wait for transition to end using an interval
    const checkInterval = setInterval(() => {
      if (!isTransitioningRef.current && !interruptedRef.current) {
        clearInterval(checkInterval);
        // Double-check we haven't been interrupted or already started
        if (runningSceneRef.current === sceneId) return;
        if (playedScenesRef.current.has(sceneId)) return;
        startSequence(ids, bodies, sceneId);
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
    };
    // Only re-run when scene changes or becomes active/enabled
    // NOT when isTransitioning changes (that's handled by the interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, isActive, sceneId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelTimer();
    };
  }, [cancelTimer]);

  return {
    activePopupId,
    glowingHotspotId,
    isAutoplaying,
    interrupt,
    playedScenes: playedScenesRef.current,
  };
}
