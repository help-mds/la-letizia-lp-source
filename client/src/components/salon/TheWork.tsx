import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TheWorkProps {
  images: string[]; // 3-4 macro close-ups (faceless)
  motionScale?: number; // luxury: 0.8 (slower), casual: 1.2 (faster)
}

/**
 * The Work — The main event. Macro close-ups revealed one by one.
 * Each image appears through a circle clip-path that expands from center.
 * Pinned section with scrubbed reveals. Faceless, texture-focused.
 */
export default function TheWork({ images, motionScale = 0.8 }: TheWorkProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const panels = section.querySelectorAll<HTMLElement>('.work-panel');
      if (panels.length === 0) return;

      // Pin the section for the duration of all reveals — generous scroll room
      const totalHeight = panels.length * 180; // vh per panel (much more scroll room for slower pace)

      // Set initial clip-path on all panels (hidden)
      panels.forEach((panel, i) => {
        if (i > 0) {
          gsap.set(panel, {
            clipPath: 'circle(0% at 50% 50%)',
            opacity: 1,
          });
        }
      });

      // Create scrubbed timeline — higher scrub value = smoother/slower feel
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalHeight}vh`,
          scrub: 2.0 * motionScale,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Reveal each panel with expanding circle — slow, deliberate reveals
      // Reserve 25% of timeline at end as HOLD on last image
      const holdRatio = 0.25;
      const animRatio = 1 - holdRatio;

      panels.forEach((panel, i) => {
        if (i === 0) return; // First panel is always visible

        const segDuration = animRatio / panels.length;
        const startTime = segDuration * i;

        // Circle expands slowly — takes 70% of segment duration
        tl.to(
          panel,
          {
            clipPath: 'circle(80% at 50% 50%)',
            duration: segDuration * 0.7,
            ease: 'power2.inOut',
          },
          startTime + segDuration * 0.15, // small delay before reveal starts
        );

        // Subtle zoom on the image inside
        const img = panel.querySelector('img');
        if (img) {
          tl.fromTo(
            img,
            { scale: 1.06 },
            {
              scale: 1,
              duration: segDuration,
              ease: 'none',
            },
            startTime,
          );
        }
      });

      // HOLD: After last reveal completes, the remaining 25% of scroll
      // keeps the last image pinned and visible before section unpins.

      // Fade the label in
      const label = section.querySelector<HTMLElement>('.work-label');
      if (label) {
        gsap.fromTo(label, { opacity: 0 }, {
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: 'power2.out',
        });
      }
    }, section);

    return () => ctx.revert();
  }, [images, motionScale]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100svh] overflow-hidden"
      style={{ backgroundColor: '#111110' }}
    >
      {/* Stacked panels */}
      {images.map((src, i) => (
        <div
          key={i}
          className="work-panel absolute inset-0 w-full h-full"
          style={{ zIndex: i + 1 }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          {/* Subtle vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.35) 100%)',
            }}
          />
        </div>
      ))}

      {/* Section label */}
      <div
        className="work-label absolute bottom-10 left-[var(--gutter)] z-20 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <p
          className="uppercase"
          style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: 'var(--fs-eyebrow)',
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          The Work
        </p>
      </div>
    </section>
  );
}
