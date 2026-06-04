import { useEffect, useRef, useState } from 'react';

/**
 * LpLoader — Redesigned loading screen for /lp/:slug
 *
 * Shows for exactly 0.8 seconds, then auto-fades out to reveal the Hero.
 * Does NOT wait for frame loading to complete.
 *
 * Layout (centered vertical stack):
 * 1. MDS logo (48px height)
 * 2. "La Letizia" Fraunces italic 48px
 * 3. Decorative line (60px)
 * 4. "CREATED BY MDS" text
 */
interface LpLoaderProps {
  ready: boolean;
  onComplete: () => void;
}

export default function LpLoader({ ready: _ready, onComplete }: LpLoaderProps) {
  const [hasExited, setHasExited] = useState(false);
  const exitTriggered = useRef(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Auto-dismiss after 0.8 seconds (regardless of frame load status)
  useEffect(() => {
    if (exitTriggered.current) return;

    const timer = setTimeout(() => {
      if (exitTriggered.current) return;
      exitTriggered.current = true;
      setFadeOut(true);

      // After fade animation completes (0.5s), unmount and notify parent
      setTimeout(() => {
        setHasExited(true);
        onComplete();
      }, 500);
    }, 800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (hasExited) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 99999,
        backgroundColor: '#FBFAF8',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
        willChange: 'opacity',
      }}
    >
      {/* MDS Logo — 48px height, top of group */}
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
