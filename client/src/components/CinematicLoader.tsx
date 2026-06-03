import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * CinematicLoader — Option B "映画のオープニング" loading screen.
 *
 * Sequence:
 * 1. Full-screen dark overlay (z-index 99999, above everything)
 * 2. Brand name letters appear one by one
 * 3. Progress counter counts 0 → 100%
 * 4. On complete: overlay slides up revealing the Hero beneath
 *
 * Props:
 * - progress: 0–1 from useFrameLoader
 * - ready: boolean when all frames loaded
 * - storeName: brand name to display
 * - onComplete: callback when exit animation finishes
 */
interface CinematicLoaderProps {
  progress: number;
  ready: boolean;
  storeName: string;
  onComplete: () => void;
}

export default function CinematicLoader({
  progress,
  ready,
  storeName,
  onComplete,
}: CinematicLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const counterRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [hasExited, setHasExited] = useState(false);
  const entryDone = useRef(false);
  const exitTriggered = useRef(false);

  // Entry animation: letters stagger in
  useEffect(() => {
    if (entryDone.current) return;
    entryDone.current = true;

    const letters = lettersRef.current.filter(Boolean);
    const counter = counterRef.current;
    const line = lineRef.current;

    // Set initial states
    gsap.set(letters, { opacity: 0, y: 20, rotateX: -90 });
    gsap.set(counter, { opacity: 0 });
    gsap.set(line, { scaleX: 0 });

    const tl = gsap.timeline({ delay: 0.3 });

    // Letters appear one by one
    tl.to(letters, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.06,
    });

    // Decorative line expands
    tl.to(line, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.inOut',
    }, '-=0.3');

    // Counter fades in
    tl.to(counter, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.4');
  }, []);

  // Exit animation when ready
  useEffect(() => {
    if (!ready || exitTriggered.current) return;
    exitTriggered.current = true;

    const overlay = overlayRef.current;
    const letters = lettersRef.current.filter(Boolean);
    const counter = counterRef.current;
    const line = lineRef.current;
    if (!overlay) return;

    const tl = gsap.timeline({
      delay: 0.4, // Brief pause at 100% for satisfaction
      onComplete: () => {
        setHasExited(true);
        onComplete();
      },
    });

    // Letters and counter fade out + slight scale up
    tl.to([...letters, counter, line], {
      opacity: 0,
      y: -10,
      duration: 0.4,
      ease: 'power2.in',
      stagger: 0.02,
    });

    // Overlay slides up and away
    tl.to(overlay, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
    }, '-=0.1');
  }, [ready, onComplete]);

  if (hasExited) return null;

  const displayPercent = Math.round(progress * 100);
  const nameChars = storeName.split('');

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 99999,
        backgroundColor: '#0E0D0C',
        willChange: 'transform',
      }}
    >
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Brand name — letter by letter */}
      <div
        className="relative"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 5vw, 56px)',
          fontWeight: 300,
          fontStyle: 'italic',
          letterSpacing: '0.08em',
          color: 'var(--overlay-text)',
          perspective: '600px',
        }}
      >
        {nameChars.map((char, i) => (
          <span
            key={i}
            ref={(el) => { if (el) lettersRef.current[i] = el; }}
            className="inline-block"
            style={{
              transformOrigin: 'center bottom',
              whiteSpace: char === ' ' ? 'pre' : undefined,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      {/* Decorative line */}
      <div
        ref={lineRef}
        className="mt-6"
        style={{
          width: '60px',
          height: '1px',
          background: 'rgba(255,255,255,0.2)',
          transformOrigin: 'center',
        }}
      />

      {/* Progress counter */}
      <div
        ref={counterRef}
        className="mt-6"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          letterSpacing: '0.3em',
          color: 'rgba(255,255,255,0.4)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {displayPercent}%
      </div>
    </div>
  );
}
