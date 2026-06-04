import { useEffect, useRef, useState } from 'react';

/**
 * LpLoader — Redesigned loading screen for /lp/:slug
 *
 * White (#FBFAF8) background with centered vertical stack:
 * 1. MDS logo (large, ~48px height) — top of group
 * 2. "La Letizia" in Fraunces italic ~48px black
 * 3. Decorative line (60px wide, 1px)
 * 4. "CREATED BY" text
 * 5. MDS logo (small, ~24px) — at bottom
 *
 * Layout matches reference: logo → title → line → "CREATED BY" → logo
 *
 * On load complete: 0.5s fade out (white bg → transparent, revealing Hero beneath)
 */
interface LpLoaderProps {
  ready: boolean;
  onComplete: () => void;
}

export default function LpLoader({ ready, onComplete }: LpLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [hasExited, setHasExited] = useState(false);
  const exitTriggered = useRef(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Exit animation when ready
  useEffect(() => {
    if (!ready || exitTriggered.current) return;
    exitTriggered.current = true;

    // Brief pause before fade out (let user see the branding)
    const timer = setTimeout(() => {
      setFadeOut(true);
      // After fade completes, unmount
      setTimeout(() => {
        setHasExited(true);
        onComplete();
      }, 550);
    }, 300);

    return () => clearTimeout(timer);
  }, [ready, onComplete]);

  if (hasExited) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 99999,
        backgroundColor: '#FBFAF8',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
        willChange: 'opacity',
      }}
    >
      {/* MDS Logo — large, top of the group */}
      <img
        src="/manus-storage/logoMDSblack_465d94de.webp"
        alt="MDS"
        style={{
          height: '48px',
          width: 'auto',
          objectFit: 'contain',
        }}
      />

      {/* "La Letizia" — Fraunces italic 48px black */}
      <div
        style={{
          marginTop: '32px',
          fontFamily: '"Fraunces", serif',
          fontStyle: 'italic',
          fontSize: '48px',
          fontWeight: 400,
          color: '#1A1714',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
        }}
      >
        La Letizia
      </div>

      {/* Decorative line — 60px wide, 1px */}
      <div
        style={{
          marginTop: '20px',
          width: '60px',
          height: '1px',
          backgroundColor: 'rgba(26, 23, 20, 0.2)',
        }}
      />

      {/* "CREATED BY" — 11px, letter-spacing 0.3em, gray */}
      <div
        style={{
          marginTop: '16px',
          fontSize: '11px',
          letterSpacing: '0.3em',
          color: 'rgba(26, 23, 20, 0.4)',
          textTransform: 'uppercase',
          fontWeight: 400,
        }}
      >
        CREATED BY
      </div>

      {/* MDS Logo — small, below "CREATED BY" */}
      <img
        src="/manus-storage/logoMDSblack_465d94de.webp"
        alt="MDS"
        style={{
          marginTop: '12px',
          height: '24px',
          width: 'auto',
          objectFit: 'contain',
          opacity: 0.7,
        }}
      />
    </div>
  );
}
