import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * Custom cursor with context-aware states:
 * - Default: small dot (8px)
 * - Link hover: expand to ring (40px)
 * - Image hover: expand with "View" text (80px)
 * - Hidden on touch devices
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    const text = textRef.current;
    if (!cursor || !dot || !text) return;

    let mouseX = 0;
    let mouseY = 0;

    // Smooth follow with GSAP
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Use GSAP ticker for smooth 60fps cursor tracking
    const updateCursor = () => {
      gsap.set(cursor, {
        x: mouseX,
        y: mouseY,
      });
    };

    gsap.ticker.add(updateCursor);
    window.addEventListener('mousemove', onMouseMove);

    // Context detection via event delegation
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a, button, [role="button"], [data-cursor-hover]');
      const image = target.closest('[data-cursor-view], .gallery-card');

      if (image) {
        // Image state: large circle with "View" text
        gsap.to(dot, {
          width: 80,
          height: 80,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderColor: 'rgba(255,255,255,0.6)',
          borderWidth: 1,
          duration: 0.3,
          ease: 'power3.out',
        });
        gsap.to(text, { opacity: 1, scale: 1, duration: 0.2 });
      } else if (link) {
        // Link state: medium ring
        gsap.to(dot, {
          width: 40,
          height: 40,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.5)',
          borderWidth: 1,
          duration: 0.3,
          ease: 'power3.out',
        });
        gsap.to(text, { opacity: 0, scale: 0.5, duration: 0.15 });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a, button, [role="button"], [data-cursor-hover]');
      const image = target.closest('[data-cursor-view], .gallery-card');

      if (link || image) {
        // Reset to default dot
        gsap.to(dot, {
          width: 8,
          height: 8,
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderColor: 'transparent',
          borderWidth: 0,
          duration: 0.3,
          ease: 'power3.out',
        });
        gsap.to(text, { opacity: 0, scale: 0.5, duration: 0.15 });
      }
    };

    // Hide cursor when leaving window
    const onMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };
    const onMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      gsap.ticker.remove(updateCursor);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <div
        ref={cursorDotRef}
        className="flex items-center justify-center rounded-full"
        style={{
          width: 8,
          height: 8,
          backgroundColor: 'rgba(255,255,255,0.9)',
          transition: 'none',
        }}
      >
        <span
          ref={textRef}
          className="text-[10px] tracking-[0.15em] uppercase text-white/90 font-light"
          style={{ opacity: 0, transform: 'scale(0.5)' }}
        >
          View
        </span>
      </div>
    </div>
  );
}

export default CustomCursor;
