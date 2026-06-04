import { useEffect, useRef, useState } from 'react';

/**
 * LpLoader — Loading screen for /lp/:slug
 *
 * Shows for 1.5 seconds, then auto-fades out to reveal the Hero.
 * Does NOT wait for frame loading to complete.
 *
 * Layout (centered vertical stack):
 * 1. Store name (Fraunces italic 48px)
 * 2. Decorative line
 * 3. "created by" text
 * 4. MDS logo (48px height) at bottom
 */
interface LpLoaderProps {
  ready: boolean;
  onComplete: () => void;
  storeName?: string;
}

export default function LpLoader({ ready: _ready, onComplete, storeName = 'La Letizia' }: LpLoaderProps) {
  const [hasExited, setHasExited] = useState(false);
  const exitTriggered = useRef(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Auto-dismiss after 1.5 seconds (0.8 + 0.7 extension)
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
    }, 1500);

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
      {/* Store name — Fraunces italic 48px black — TOP of group */}
      <div
        style={{
          fontFamily: '"Fraunces", serif',
          fontStyle: 'italic',
          fontSize: '48px',
          fontWeight: 400,
          color: '#1A1714',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
        }}
      >
        {storeName}
      </div>

      {/* Decorative line — 60px wide, 1px */}
      <div
        style={{
          marginTop: '24px',
          width: '60px',
          height: '1px',
          backgroundColor: 'rgba(26, 23, 20, 0.2)',
        }}
      />

      {/* "created by" — 11px, letter-spacing 0.2em, gray */}
      <div
        style={{
          marginTop: '16px',
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: 'rgba(26, 23, 20, 0.4)',
          textTransform: 'lowercase',
          fontWeight: 400,
        }}
      >
        created by
      </div>

      {/* MDS Logo — 48px height, BOTTOM of group */}
      <img
        src="/manus-storage/logoMDSblack_465d94de.webp"
        alt="MDS"
        style={{
          marginTop: '12px',
          height: '48px',
          width: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
