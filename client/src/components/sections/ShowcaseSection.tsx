import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

interface ShowcaseSectionProps {
  items: ShowcaseItem[];
  label?: string;
}

/**
 * Showcase Section — Full-screen continuous morph
 *
 * NOT a card gallery. Each item occupies the entire viewport.
 * GSAP ScrollTrigger Pin + timeline scrubs scale/x/opacity
 * to create a cinematic continuous transformation effect.
 *
 * Scroll runway = items.length × 100vh (pinned).
 */
export default function ShowcaseSection({ items, label = 'Selection' }: ShowcaseSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || items.length === 0) return;

    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      // Main pin: pin the section for (items.length) * 100vh of scroll
      const totalScroll = items.length * 100;

      // Set initial states: first item visible, rest hidden
      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        if (i === 0) {
          gsap.set(el, { opacity: 1, scale: 1, x: '0%', zIndex: items.length - i });
        } else {
          gsap.set(el, { opacity: 0, scale: 0.85, x: '15%', zIndex: items.length - i });
        }
      });

      // Create a master timeline pinned to the section
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalScroll}vh`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // For each transition between items
      for (let i = 0; i < items.length - 1; i++) {
        const current = itemsRef.current[i];
        const next = itemsRef.current[i + 1];
        if (!current || !next) continue;

        // Current item: scale down + move left + fade out
        masterTl.to(
          current,
          {
            scale: 0.7,
            x: '-30%',
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut',
          },
          i, // position in timeline
        );

        // Next item: scale up + move from right to center + fade in
        masterTl.fromTo(
          next,
          { scale: 0.85, x: '15%', opacity: 0 },
          {
            scale: 1,
            x: '0%',
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut',
          },
          i, // same position = simultaneous
        );
      }

      // Hold last item for a beat
      masterTl.to({}, { duration: 0.3 });

      if (masterTl.scrollTrigger) triggers.push(masterTl.scrollTrigger);
    }, section);

    return () => {
      ctx.revert();
      triggers.forEach((t) => t.kill());
    };
  }, [items]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        height: '100vh', // visual height (gets pinned)
        backgroundColor: '#0E0D0C',
      }}
      id="showcase"
    >
      {/* Section label — top left */}
      <div
        className="absolute top-0 left-0 z-50 pointer-events-none"
        style={{
          padding: 'var(--gutter)',
          paddingTop: 'clamp(24px, 4vh, 48px)',
        }}
      >
        <p
          className="uppercase"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-eyebrow)',
            letterSpacing: '0.32em',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          {label}
        </p>
      </div>

      {/* Items — each is a full-viewport layer */}
      {items.map((item, i) => (
        <div
          key={item.id}
          ref={(el) => { itemsRef.current[i] = el; }}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            willChange: 'transform, opacity',
          }}
        >
          {/* Full-bleed image */}
          <div className="absolute inset-0">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              style={{
                filter: 'brightness(0.75)',
              }}
            />
            {/* Gradient overlay for text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(to top, rgba(14,13,12,0.85) 0%, rgba(14,13,12,0.2) 40%, transparent 70%),
                  linear-gradient(to bottom, rgba(14,13,12,0.3) 0%, transparent 20%)
                `,
              }}
            />
          </div>

          {/* Text content — bottom center */}
          <div
            className="absolute bottom-0 left-0 right-0 text-center"
            style={{
              padding: 'var(--gutter)',
              paddingBottom: 'clamp(60px, 12vh, 140px)',
              zIndex: 2,
            }}
          >
            {/* Item counter */}
            <p
              className="uppercase mb-3"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </p>
            {/* Title */}
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.0,
                color: 'rgba(255,255,255,0.92)',
                marginBottom: '12px',
              }}
            >
              {item.title}
            </h2>
            {/* Subtitle */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.55)',
                maxWidth: '32ch',
                margin: '0 auto',
              }}
            >
              {item.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Progress indicator — right side */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
        style={{ paddingRight: 'var(--gutter)' }}
      >
        <div className="flex flex-col gap-2">
          {items.map((_, i) => (
            <div
              key={i}
              className="w-[2px] rounded-full transition-all duration-300"
              style={{
                height: '20px',
                backgroundColor: 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
