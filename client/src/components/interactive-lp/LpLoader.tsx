import { useEffect, useRef, useState } from 'react';

/**
 * LpLoader — Redesigned loading screen for /lp/:slug
 *
 * White (#FBFAF8) background with:
 * - MDS logo (48px height, centered)
 * - "La Letizia" in Fraunces italic 48px black (32px below logo)
 * - Decorative line (60px wide, 1px)
 * - "CREATED BY MDS" in 11px, letter-spacing 0.3em, gray
 * - No percentage display
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
      {/* MDS Logo — 48px height, centered */}
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

      {/* "CREATED BY MDS" — 11px, letter-spacing 0.3em, gray */}
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
        CREATED BY MDS
      </div>
    </div>
  );
}
