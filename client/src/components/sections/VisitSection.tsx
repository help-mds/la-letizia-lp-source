import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VisitSectionProps {
  storeName: string;
  quote?: string;
  hours?: string;
  reservationUrl?: string;
  address?: string;
}

/**
 * Visit Section — Cinematic endroll CTA
 *
 * Movie credits style: owner quote → hours → reserve CTA
 * Deep dark background, large Fraunces typography, editorial pacing.
 */
export default function VisitSection({
  storeName,
  quote = 'Every detail, every flame, every cut — for you.',
  hours = 'Tue – Sun, 6 PM – 12 AM',
  reservationUrl = '#',
  address,
}: VisitSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    elementsRef.current.forEach((el, i) => {
      if (!el) return;

      gsap.set(el, { opacity: 0, y: 40 });

      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 60%',
          scrub: 0.5,
        },
      });

      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        backgroundColor: '#080807',
        padding: 'clamp(100px, 20vh, 240px) 0',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
      id="visit"
    >
      <div
        className="text-center w-full"
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '0 var(--gutter)',
        }}
      >
        {/* Store name eyebrow */}
        <p
          ref={(el) => { elementsRef.current[0] = el; }}
          className="uppercase"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-eyebrow)',
            letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 'clamp(24px, 4vh, 48px)',
          }}
        >
          {storeName}
        </p>

        {/* Owner quote */}
        <blockquote
          ref={(el) => { elementsRef.current[1] = el; }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.3,
            color: 'rgba(255,255,255,0.88)',
            marginBottom: 'clamp(40px, 8vh, 80px)',
          }}
        >
          "{quote}"
        </blockquote>

        {/* Divider */}
        <div
          ref={(el) => { elementsRef.current[2] = el; }}
          className="mx-auto"
          style={{
            width: '40px',
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            marginBottom: 'clamp(32px, 6vh, 60px)',
          }}
        />

        {/* Hours */}
        <p
          ref={(el) => { elementsRef.current[3] = el; }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '12px',
          }}
        >
          {hours}
        </p>

        {/* Address */}
        {address && (
          <p
            ref={(el) => { elementsRef.current[4] = el; }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.8rem, 1.1vw, 0.9rem)',
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 'clamp(40px, 6vh, 60px)',
            }}
          >
            {address}
          </p>
        )}

        {/* CTA Button */}
        <div
          ref={(el) => { elementsRef.current[5] = el; }}
          style={{ marginTop: address ? '0' : 'clamp(40px, 6vh, 60px)' }}
        >
          <a
            href={reservationUrl}
            className="inline-block uppercase transition-all duration-200"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '18px 48px',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.6)';
              (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
              (e.target as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            Reserve a Table
          </a>
        </div>
      </div>
    </section>
  );
}
