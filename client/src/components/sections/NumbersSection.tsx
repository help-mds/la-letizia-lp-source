import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface NumberItem {
  number: string;
  label: string;
}

interface NumbersSectionProps {
  items: NumberItem[];
}

/**
 * Numbers Section — Large typography kinetic reveal
 *
 * Each number/label pair animates in with stagger as user scrolls.
 * Editorial whitespace, Fraunces heading font.
 */
export default function NumbersSection({ items }: NumbersSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    itemsRef.current.forEach((el, i) => {
      if (!el) return;

      gsap.set(el, { opacity: 0, y: 60 });

      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 55%',
          scrub: 0.5,
        },
      });

      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [items]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        backgroundColor: '#0E0D0C',
        padding: 'clamp(80px, 15vh, 200px) 0',
      }}
      id="numbers"
    >
      <div
        style={{
          maxWidth: 'var(--maxw)',
          margin: '0 auto',
          padding: '0 var(--gutter)',
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el) => { itemsRef.current[i] = el; }}
            className="text-center"
            style={{
              padding: 'clamp(40px, 8vh, 80px) 0',
              willChange: 'transform, opacity',
            }}
          >
            {/* Large number */}
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 0.9,
                color: 'rgba(255,255,255,0.92)',
                marginBottom: '8px',
              }}
            >
              {item.number}
            </p>
            {/* Label */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
