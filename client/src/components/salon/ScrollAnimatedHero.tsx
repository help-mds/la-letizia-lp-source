import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimatedHeroProps {
  images: string[];
  storeName: string;
  subtitle?: string;
  motionScale?: number; // luxury: 0.8, casual: 1.2
  onImagesLoaded?: () => void;
}

/**
 * 🔴 LOCK — ScrollAnimatedHero
 * 3-image cross-fade with Ken Burns effect on scroll.
 * The hero for salon "The Ritual" template.
 * Each image fades in sequentially as user scrolls, with subtle scale animation.
 * Pinned at 100svh, scrolls through 400svh of animation for smooth pacing.
 */
export default function ScrollAnimatedHero({
  images,
  storeName,
  subtitle,
  motionScale = 0.8,
  onImagesLoaded,
}: ScrollAnimatedHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload all images
  useEffect(() => {
    if (images.length === 0) return;
    let loaded = 0;
    images.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded >= images.length) {
          setImagesLoaded(true);
          onImagesLoaded?.();
        }
      };
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || images.length === 0 || !imagesLoaded) return;

    const ctx = gsap.context(() => {
      const imgEls = imagesRef.current.filter(Boolean);
      if (imgEls.length === 0) return;

      // Set initial states — first image visible, rest hidden
      gsap.set(imgEls[0], { opacity: 1, scale: 1 });
      imgEls.slice(1).forEach((el) => {
        gsap.set(el, { opacity: 0, scale: 1.05 });
      });

      // Create a timeline scrubbed by scroll — longer scroll = much smoother pace
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=600vh',
          scrub: 2.5 * motionScale,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Cross-fade between images with Ken Burns (subtle scale)
      // Reserve 20% of timeline at the end as a HOLD on the last image
      const holdRatio = 0.2; // 20% of scroll is just holding the last image
      const animRatio = 1 - holdRatio; // 80% for actual transitions
      const segmentDuration = animRatio / Math.max(imgEls.length - 1, 1);

      imgEls.forEach((el, i) => {
        if (i === 0) {
          // First image: Ken Burns scale up, then slow fade out
          tl.to(el, {
            scale: 1.05,
            duration: segmentDuration,
            ease: 'none',
          }, 0);
          if (imgEls.length > 1) {
            // Hold longer before fading — fade starts at 75% of segment
            tl.to(el, {
              opacity: 0,
              duration: segmentDuration * 0.25,
              ease: 'power2.inOut',
            }, segmentDuration * 0.75);
          }
        } else {
          // Each subsequent image starts fading in later
          const startTime = segmentDuration * (i - 1) + segmentDuration * 0.65;
          // Slow fade in
          tl.to(el, {
            opacity: 1,
            scale: 1,
            duration: segmentDuration * 0.35,
            ease: 'power2.inOut',
          }, startTime);
          // Ken Burns on this image
          tl.to(el, {
            scale: 1.05,
            duration: segmentDuration,
            ease: 'none',
          }, startTime);
          // Fade out (except last) — hold longer
          if (i < imgEls.length - 1) {
            tl.to(el, {
              opacity: 0,
              duration: segmentDuration * 0.25,
              ease: 'power2.inOut',
            }, startTime + segmentDuration * 0.75);
          }
        }
      });

      // HOLD: last image stays pinned for the remaining 20% of scroll
      // This is achieved by the timeline ending at 1.0 but the last image
      // animation ending at animRatio (0.8) — the remaining scroll just holds.

      // Text reveal — immediate, no scroll dependency
      if (textRef.current) {
        gsap.from(textRef.current, {
          opacity: 0,
          y: 24,
          duration: 1.8,
          delay: 0.4,
          ease: 'power3.out',
        });
      }
    }, container);

    return () => ctx.revert();
  }, [images, motionScale, imagesLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Image layers */}
      {images.map((src, i) => (
        <div
          key={i}
          ref={(el) => { if (el) imagesRef.current[i] = el; }}
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Gradient overlay — subtle bottom fade for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 30%, transparent 80%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* Text overlay — bottom-left, editorial positioning */}
      <div
        ref={textRef}
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-[10vh]"
        style={{ zIndex: 10 }}
      >
        {/* Eyebrow */}
        <p
          className="uppercase mb-4"
          style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '11px',
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          {subtitle || 'The Ritual'}
        </p>

        {/* Store name */}
        <h1
          style={{
            fontFamily: '"Fraunces", serif',
            fontSize: 'clamp(38px, 7vw, 82px)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.05,
            color: 'rgba(255,255,255,0.95)',
            textAlign: 'center',
            letterSpacing: '-0.01em',
          }}
        >
          {storeName}
        </h1>
      </div>
    </section>
  );
}
