import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * SalonLoader — Cinematic loading screen for salon "The Ritual" template.
 *
 * Differentiation from restaurant CinematicLoader:
 * - Lighter, more refined aesthetic (still dark overlay for contrast)
 * - Fraunces italic font
 * - Thinner, more delicate progress line
 * - Slower, more deliberate animation timing (matches salon's "time" concept)
 *
 * Sequence:
 * 1. Full-screen dark overlay (z-index 99999)
 * 2. Store name letters appear one by one (Fraunces italic)
 * 3. Thin progress line fills
 * 4. On images loaded: overlay fades out revealing the Hero
 */
interface SalonLoaderProps {
  storeName: string;
  imagesReady: boolean;
  onComplete: () => void;
}

export default function SalonLoader({
  storeName,
  imagesReady,
  onComplete,
}: SalonLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const [hasExited, setHasExited] = useState(false);
  const entryDone = useRef(false);
  const exitTriggered = useRef(false);

  // Entry animation
  useEffect(() => {
    if (entryDone.current) return;
    entryDone.current = true;

    const letters = lettersRef.current.filter(Boolean);
    const line = lineRef.current;
    const eyebrow = eyebrowRef.current;

    gsap.set(letters, { opacity: 0, y: 14 });
    gsap.set(line, { opacity: 0 });
    gsap.set(eyebrow, { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.4 });

    // Eyebrow fades in
    tl.to(eyebrow, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    });

    // Letters appear one by one — slower for salon
    tl.to(letters, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.07,
    }, '-=0.4');

    // Progress line appears
    tl.to(line, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.2');
  }, []);

  // Animate progress line fill based on image loading
  useEffect(() => {
    if (!lineFillRef.current) return;
    // Simulate progress — if images are ready, fill to 100%
    const target = imagesReady ? 1 : 0.6;
    gsap.to(lineFillRef.current, {
      scaleX: target,
      duration: imagesReady ? 0.6 : 2.0,
      ease: imagesReady ? 'power2.out' : 'power1.inOut',
    });
  }, [imagesReady]);

  // Exit animation when ready
  useEffect(() => {
    if (!imagesReady || exitTriggered.current) return;
    exitTriggered.current = true;

    const overlay = overlayRef.current;
    const letters = lettersRef.current.filter(Boolean);
    const line = lineRef.current;
    const eyebrow = eyebrowRef.current;
    if (!overlay) return;

    const tl = gsap.timeline({
      delay: 0.6, // Hold at 100% — let user appreciate the brand name
      onComplete: () => {
        setHasExited(true);
        onComplete();
      },
    });

    // Content fades out gently
    tl.to([...letters, line, eyebrow], {
      opacity: 0,
      y: -8,
      duration: 0.5,
      ease: 'power2.in',
      stagger: 0.02,
    });

    // Overlay fades out (not slide — softer for salon)
    tl.to(overlay, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    }, '-=0.2');
  }, [imagesReady, onComplete]);

  if (hasExited) return null;

  const nameChars = storeName.split('');

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 99999,
        backgroundColor: '#0E0D0C',
        willChange: 'opacity',
      }}
    >
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Eyebrow — "The Ritual" */}
      <p
        ref={eyebrowRef}
        className="uppercase mb-6"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.4em',
          color: 'rgba(255,255,255,0.35)',
        }}
      >
        The Ritual
      </p>

      {/* Brand name — letter by letter in Fraunces italic */}
      <div
        className="relative"
        style={{
          fontFamily: '"Fraunces", serif',
          fontSize: 'clamp(32px, 6vw, 64px)',
          fontWeight: 300,
          fontStyle: 'italic',
          letterSpacing: '0.04em',
          color: 'rgba(255,255,255,0.9)',
        }}
      >
        {nameChars.map((char, i) => (
          <span
            key={i}
            ref={(el) => { if (el) lettersRef.current[i] = el; }}
            className="inline-block"
            style={{
              whiteSpace: char === ' ' ? 'pre' : undefined,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      {/* Progress line — thin and delicate */}
      <div
        ref={lineRef}
        className="mt-10 relative"
        style={{
          width: 'clamp(80px, 12vw, 140px)',
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.1)',
        }}
      >
        <div
          ref={lineFillRef}
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(255,255,255,0.5)',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>
    </div>
  );
}
