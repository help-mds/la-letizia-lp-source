import { useState, useCallback, useRef, useEffect } from 'react';
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
 * InteractiveScene: A full-viewport scene with a Ken Burns animated background,
 * pulsing "+" hotspots, and center modal popups.
 *
 * Used for scenes 1-3 (The Space, The Selection, The Craft).
 * Each scene is a single large photo with interactive discovery points.
 */
export default function InteractiveScene({
  imageUrl,
  hotspots,
  isActive,
  onCtaAction,
}: InteractiveSceneProps) {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleHotspotClick = useCallback((id: string) => {
    setActivePopup((prev) => (prev === id ? null : id));
  }, []);

  const handleClosePopup = useCallback(() => {
    setActivePopup(null);
  }, []);

  // Close on backdrop click (outside the modal content)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setActivePopup(null);
      }
    },
    [],
  );

  const handleCtaClick = useCallback(
    (action: string) => {
      onCtaAction?.(action);
    },
    [onCtaAction],
  );

  const activeHotspot = hotspots.find((h) => h.id === activePopup);

  return (
    <div className="absolute inset-0 overflow-hidden">
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

      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          className="hotspot-btn"
          style={{
            position: 'absolute',
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onClick={() => handleHotspotClick(hotspot.id)}
          aria-label={hotspot.title}
        >
          <span className="hotspot-plus">+</span>
          <span className="hotspot-ripple" />
        </button>
      ))}

      {/* Center Modal Popup with backdrop */}
      {activePopup && activeHotspot && (
        <div
          className="scene-popup-backdrop"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={activeHotspot.title}
        >
          <div ref={modalRef} className="scene-popup-modal">
            <button
              className="scene-popup-close"
              onClick={handleClosePopup}
              aria-label="Close"
            >
              <IconX size={18} />
            </button>
            <div className="scene-popup-title">{activeHotspot.title}</div>
            <div className="scene-popup-body">{activeHotspot.body}</div>
            {activeHotspot.price && (
              <div className="scene-popup-price">{activeHotspot.price}</div>
            )}
            {activeHotspot.ctas && activeHotspot.ctas.length > 0 && (
              <div className="scene-popup-ctas">
                {activeHotspot.ctas.map((cta) => (
                  <button
                    key={cta.action}
                    className="scene-popup-cta-btn"
                    onClick={() => handleCtaClick(cta.action)}
                  >
                    {cta.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
