import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollDrivenScene — maps scroll progress within a pinned section
 * to discrete popup steps.
 *
 * Steps for a scene with N hotspots:
 *   step 0: scene visible, no popup (chapter title moment)
 *   step 1: popup[0] visible
 *   step 2: popup[1] visible
 *   ...
 *   step N: popup[N-1] visible
 *   (after last step, pin releases → next section)
 *
 * Total steps = N + 1 (intro + N popups)
 * Scroll runway = (N + 1) * 100vh per scene
 *
 * Snap: progress snaps to discrete step positions.
 */

export interface ScrollDrivenSceneOptions {
  /** The section element ref to pin */
  sectionRef: React.RefObject<HTMLElement | null>;
  /** Hotspot IDs in display order */
  hotspotIds: string[];
  /** Whether this scene should be scroll-driven */
  enabled: boolean;
  /** Unique scene identifier for ScrollTrigger labeling */
  sceneId: string;
}

export interface ScrollDrivenSceneState {
  /** Current discrete step (0 = intro, 1+ = popup index + 1) */
  currentStep: number;
  /** Active popup ID (null for step 0) */
  activePopupId: string | null;
  /** Glowing hotspot ID (briefly set during step transition) */
  glowingHotspotId: string | null;
  /** Raw scroll progress 0-1 */
  progress: number;
  /** Whether user is in override mode (tapped a hotspot directly) */
  overrideMode: boolean;
  /** Override popup ID */
  overridePopupId: string | null;
  /** Enter override mode */
  setOverride: (hotspotId: string | null) => void;
  /** Exit override mode */
  clearOverride: () => void;
}

export function useScrollDrivenScene({
  sectionRef,
  hotspotIds,
  enabled,
  sceneId,
}: ScrollDrivenSceneOptions): ScrollDrivenSceneState {
  const [currentStep, setCurrentStep] = useState(0);
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const [glowingHotspotId, setGlowingHotspotId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [overrideMode, setOverrideMode] = useState(false);
  const [overridePopupId, setOverridePopupId] = useState<string | null>(null);

  const prevStepRef = useRef(0);
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  // Override mode handlers
  const setOverride = useCallback((hotspotId: string | null) => {
    setOverrideMode(true);
    setOverridePopupId(hotspotId);
  }, []);

  const clearOverride = useCallback(() => {
    setOverrideMode(false);
    setOverridePopupId(null);
  }, []);

  useLayoutEffect(() => {
    if (!enabled || !sectionRef.current || hotspotIds.length === 0) return;

    const section = sectionRef.current;
    const totalSteps = hotspotIds.length + 1; // intro + N popups

    // Calculate scroll runway in pixels to avoid vh parsing issues
    const viewportHeight = window.innerHeight;
    const scrollRunwayPx = totalSteps * viewportHeight;

    // Snap points: evenly distributed
    const snapPoints = Array.from({ length: totalSteps }, (_, i) => i / (totalSteps - 1));

    // Kill any existing trigger for this scene before creating a new one
    if (triggerRef.current) {
      triggerRef.current.kill(true); // true = revert pin
      triggerRef.current = null;
    }

    // Small delay to ensure DOM is settled after any React strict mode remount
    const timer = setTimeout(() => {
      if (!section.isConnected) return; // Element was removed from DOM

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${scrollRunwayPx}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.3,
        anticipatePin: 1,
        snap: {
          snapTo: snapPoints,
          duration: { min: 0.2, max: 0.5 },
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);

          // Derive step from progress
          const step = Math.min(
            Math.round(p * (totalSteps - 1)),
            totalSteps - 1,
          );
          setCurrentStep(step);

          // Derive active popup from step
          if (step === 0) {
            setActivePopupId(null);
          } else {
            const popupIndex = step - 1;
            if (popupIndex < hotspotIds.length) {
              setActivePopupId(hotspotIds[popupIndex]);
            }
          }

          // Auto-clear override when step changes
          if (step !== prevStepRef.current) {
            setOverrideMode(false);
            setOverridePopupId(null);

            // Glow effect on step change (new popup appearing)
            if (step > 0) {
              const newHotspotId = hotspotIds[step - 1];
              setGlowingHotspotId(newHotspotId);
              if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
              glowTimerRef.current = setTimeout(() => {
                setGlowingHotspotId(null);
              }, 600);
            } else {
              setGlowingHotspotId(null);
            }

            prevStepRef.current = step;
          }
        },
        // Clear popup when scrolling past this scene
        onLeave: () => {
          setActivePopupId(null);
          setGlowingHotspotId(null);
          setOverrideMode(false);
          setOverridePopupId(null);
        },
        // Clear popup when scrolling back above this scene
        onLeaveBack: () => {
          setActivePopupId(null);
          setGlowingHotspotId(null);
          setOverrideMode(false);
          setOverridePopupId(null);
          prevStepRef.current = 0;
        },
      });

      triggerRef.current = trigger;

      // Force a refresh to ensure correct measurements
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (triggerRef.current) {
        triggerRef.current.kill(true);
        triggerRef.current = null;
      }
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, sceneId, hotspotIds.length]);

  // Effective popup: override takes priority
  const effectivePopupId = overrideMode ? overridePopupId : activePopupId;

  return {
    currentStep,
    activePopupId: effectivePopupId,
    glowingHotspotId,
    progress,
    overrideMode,
    overridePopupId,
    setOverride,
    clearOverride,
  };
}
