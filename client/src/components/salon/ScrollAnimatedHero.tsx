import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

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
 * Uses tall container + sticky viewport (no GSAP pin) for reliable timing.
 *
 * Architecture:
 * - Outer div: height = totalScrollHeight (e.g. 500svh)
 * - Inner sticky div: 100svh, stays pinned naturally via CSS sticky
 * - Scroll progress computed from container geometry
 * - Cross-fade controlled by progress value
 *
 * Timeline distribution (normalized 0→1):
 * - 0.00 → 0.30: Image 1 visible (Ken Burns slow zoom)
 * - 0.25 → 0.55: Image 2 fades in (overlap for cross-fade)
 * - 0.50 → 0.80: Image 3 fades in
 * - 0.80 → 1.00: HOLD — last image stays, no transition
 */
export default function ScrollAnimatedHero({
  images,
  storeName,
  subtitle,
  motionScale = 0.8,
  onImagesLoaded,
}: ScrollAnimatedHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const rafId = useRef<number | null>(null);

  // Total scroll runway — generous for slow, luxurious pacing
  const totalScrollVh = 500;

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

  // Text entrance animation
  useEffect(() => {
    if (!imagesLoaded || !textRef.current) return;
    gsap.from(textRef.current, {
      opacity: 0,
      y: 24,
      duration: 1.8,
      delay: 0.4,
      ease: 'power3.out',
    });
  }, [imagesLoaded]);

  // Scroll-driven cross-fade
  const updateImages = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scrollableHeight = container.scrollHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

    const imgEls = imagesRef.current.filter(Boolean);
    const numImages = imgEls.length;
    if (numImages === 0) return;

    // Timeline layout:
    // Each image has a "zone" where it's fully visible
    // Hold ratio at the end for the last image
    const holdRatio = 0.25; // 25% of scroll is just holding last image
    const animRange = 1 - holdRatio; // 75% for transitions

    // Each image gets an equal slice of the animation range
    const sliceWidth = animRange / numImages;

    imgEls.forEach((el, i) => {
      // Each image is fully visible in the center of its slice
      const sliceStart = sliceWidth * i;
      const sliceEnd = sliceWidth * (i + 1);

      // Fade in: from (sliceStart - overlap) to sliceStart
      // Fade out: from sliceEnd to (sliceEnd + overlap)
      const fadeWidth = sliceWidth * 0.35; // 35% overlap for smooth cross-fade

      let opacity: number;

      if (i === 0) {
        // First image: starts at 1, fades out at end of its slice
        if (progress <= sliceEnd - fadeWidth) {
          opacity = 1;
        } else if (progress <= sliceEnd) {
          opacity = 1 - (progress - (sliceEnd - fadeWidth)) / fadeWidth;
        } else {
          opacity = 0;
        }
      } else if (i === numImages - 1) {
        // Last image: fades in, then stays at 1 (including hold)
        const fadeInStart = sliceStart - fadeWidth;
        if (progress <= fadeInStart) {
          opacity = 0;
        } else if (progress <= sliceStart) {
          opacity = (progress - fadeInStart) / fadeWidth;
        } else {
          opacity = 1; // Stays visible through hold period
        }
      } else {
        // Middle images: fade in, hold, fade out
        const fadeInStart = sliceStart - fadeWidth;
        if (progress <= fadeInStart) {
          opacity = 0;
        } else if (progress <= sliceStart) {
          opacity = (progress - fadeInStart) / fadeWidth;
        } else if (progress <= sliceEnd - fadeWidth) {
          opacity = 1;
        } else if (progress <= sliceEnd) {
          opacity = 1 - (progress - (sliceEnd - fadeWidth)) / fadeWidth;
        } else {
          opacity = 0;
        }
      }

      // Ken Burns: subtle scale based on how far into the image's visible zone
      const visibleProgress = Math.max(0, Math.min(1, (progress - sliceStart) / sliceWidth));
      const scale = 1 + visibleProgress * 0.05; // 1.0 → 1.05

      el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      el.style.transform = `scale(${scale})`;
    });
  }, []);

  // Scroll listener
  useEffect(() => {
    if (!imagesLoaded) return;

    const handleScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        updateImages();
      });
    };

    // Initial render
    updateImages();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [imagesLoaded, updateImages]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${totalScrollVh}svh` }}
    >
      {/* Sticky viewport — stays in view while user scrolls through the tall container */}
      <div
        ref={viewportRef}
        className="sticky top-0 w-full h-[100svh] overflow-hidden"
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

        {/* Text overlay — centered bottom */}
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
      </div>
    </div>
  );
}
