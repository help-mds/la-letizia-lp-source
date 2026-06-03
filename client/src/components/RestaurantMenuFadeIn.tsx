import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Cinematic breathing-room transition between the dark scroll-scrub hero
 * and the AtmosphereSection below.
 *
 * Design: The screen fades to black, a minimal "Discover" text appears,
 * then the next image materializes from the darkness. No white gap.
 * The bridge stays dark throughout — the AtmosphereSection emerges from it.
 */
export default function RestaurantMenuFadeIn() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      text.style.opacity = '1';
      return;
    }

    gsap.set(text, { opacity: 0, y: 16 });
    const tween = gsap.to(text, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 50%',
        toggleActions: 'play none none none',
        once: true,
      },
    });

    return () => {
      tween.kill();
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      aria-hidden
      className="relative w-full"
      style={{
        /* Tall enough for cinematic pacing */
        height: 'clamp(40vh, 50vh, 60vh)',
        /* Pure dark background — no white anywhere */
        backgroundColor: '#0E0D0C',
      }}
    >
      {/* Top gradient: blends from the video's dark tones into solid black */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: '40%',
          background: 'linear-gradient(to bottom, rgba(14,13,12,0.4) 0%, #0E0D0C 100%)',
        }}
      />

      {/* Subtle noise texture for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Centered editorial text — chapter break moment */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ padding: 'var(--gutter)' }}
      >
        <div className="text-center">
          {/* Thin decorative line */}
          <div
            className="mx-auto mb-6"
            style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2))',
            }}
          />
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.4em',
              color: 'rgba(255, 255, 255, 0.35)',
              lineHeight: 2,
            }}
          >
            Discover
          </p>
        </div>
      </div>

      {/* Bottom: NO gradient to white — stays dark. AtmosphereSection overlaps from here. */}
    </div>
  );
}
