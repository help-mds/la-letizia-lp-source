import { useState, useCallback, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';

/**
 * Hotspot data structure for interactive scenes.
 * Position is percentage-based for responsive placement.
 */
export interface Hotspot {
  id: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  title: string;
  body: string;
  price?: string;
  ctas?: Array<{ label: string; action: string }>;
}

interface InteractiveSceneProps {
  imageUrl: string;
  hotspots: Hotspot[];
  isActive: boolean;
  onCtaAction?: (action: string) => void;
}

/**
 * Compute tooltip position class based on hotspot location.
 * Tooltip appears to the right by default, or left if hotspot is on the right side.
 */
function getTooltipSide(x: number): 'right' | 'left' {
  return x > 60 ? 'left' : 'right';
}

/**
 * InteractiveScene: A full-viewport scene with a Ken Burns animated background,
 * pulsing "?" hotspots, and tooltip popups anchored beside each hotspot.
 */
export default function InteractiveScene({
  imageUrl,
  hotspots,
  isActive,
  onCtaAction,
}: InteractiveSceneProps) {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  // Close popup on Escape key
  useEffect(() => {
    if (!activePopup) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePopup(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activePopup]);

  // Close popup when scene becomes inactive
  useEffect(() => {
    if (!isActive) setActivePopup(null);
  }, [isActive]);

  // Close on click anywhere outside hotspots/tooltips
  const handleBackgroundClick = useCallback(() => {
    if (activePopup) setActivePopup(null);
  }, [activePopup]);

  const handleHotspotClick = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActivePopup((prev) => (prev === id ? null : id));
  }, []);

  const handleClosePopup = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePopup(null);
  }, []);

  const handleCtaClick = useCallback(
    (e: React.MouseEvent, action: string) => {
      e.stopPropagation();
      onCtaAction?.(action);
    },
    [onCtaAction],
  );

  return (
    <div className="absolute inset-0 overflow-hidden" onClick={handleBackgroundClick}>
      {/* Ken Burns animated background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
          animation: isActive ? 'kenBurns 18s ease-in-out infinite alternate' : 'none',
          willChange: 'transform',
        }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 150px rgba(0,0,0,0.55)' }}
      />

      {/* Hotspots with inline tooltips */}
      {hotspots.map((hotspot) => {
        const isOpen = activePopup === hotspot.id;
        const side = getTooltipSide(hotspot.x);

        return (
          <div
            key={hotspot.id}
            className="hotspot-anchor"
            style={{
              position: 'absolute',
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* The ? button */}
            <button
              className={`hotspot-btn ${isOpen ? 'hotspot-btn--active' : ''}`}
              onClick={(e) => handleHotspotClick(e, hotspot.id)}
              aria-label={hotspot.title}
              aria-expanded={isOpen}
            >
              <span className="hotspot-icon">?</span>
              {!isOpen && <span className="hotspot-ripple" />}
            </button>

            {/* Tooltip anchored beside the hotspot */}
            {isOpen && (
              <div
                className={`hotspot-tooltip hotspot-tooltip--${side}`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="hotspot-tooltip-close"
                  onClick={handleClosePopup}
                  aria-label="Close"
                >
                  <IconX size={14} />
                </button>
                <div className="hotspot-tooltip-title">{hotspot.title}</div>
                <div className="hotspot-tooltip-body">{hotspot.body}</div>
                {hotspot.price && (
                  <div className="hotspot-tooltip-price">{hotspot.price}</div>
                )}
                {hotspot.ctas && hotspot.ctas.length > 0 && (
                  <div className="hotspot-tooltip-ctas">
                    {hotspot.ctas.map((cta) => (
                      <button
                        key={cta.action}
                        className="hotspot-tooltip-cta-btn"
                        onClick={(e) => handleCtaClick(e, cta.action)}
                      >
                        {cta.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
