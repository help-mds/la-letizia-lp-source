import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from '@/components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

interface LingeringProps {
  storeName: string;
  ctaLabel?: string;
  ctaUrl?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

/**
 * Lingering — The afterglow. CTA + contact info with generous whitespace.
 * The feeling of not wanting to leave.
 */
export default function Lingering({
  storeName,
  ctaLabel = 'Book Your Ritual',
  ctaUrl = '#',
  phone,
  address,
  hours,
}: LingeringProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = section.querySelectorAll<HTMLElement>('.linger-reveal');
      elements.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        padding: 'clamp(100px, 15vw, 200px) var(--gutter)',
        backgroundColor: 'var(--salon-bg, #fafaf9)',
      }}
    >
      <div className="max-w-[700px] mx-auto text-center">
        {/* Store name — large italic */}
        <h2
          className="linger-reveal"
          style={{
            fontFamily: '"Fraunces", serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.15,
            color: 'var(--salon-ink, #1a1a1a)',
            opacity: 0,
            marginBottom: 'clamp(32px, 5vw, 56px)',
          }}
        >
          {storeName}
        </h2>

        {/* CTA Button */}
        <div className="linger-reveal" style={{ opacity: 0, marginBottom: 'clamp(48px, 8vw, 96px)' }}>
          <MagneticButton as="a" href={ctaUrl} strength={0.2}>
            <span
              className="inline-block px-10 py-4 border transition-all duration-300 hover:bg-[var(--salon-ink,#1a1a1a)] hover:text-[var(--salon-bg,#fafaf9)]"
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                borderColor: 'var(--salon-ink, #1a1a1a)',
                color: 'var(--salon-ink, #1a1a1a)',
                borderRadius: '0',
              }}
            >
              {ctaLabel}
            </span>
          </MagneticButton>
        </div>

        {/* Contact info — minimal, editorial */}
        <div
          className="linger-reveal grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 pt-10 border-t"
          style={{ borderColor: 'rgba(0,0,0,0.07)', opacity: 0 }}
        >
          {address && (
            <div className="text-left md:text-center">
              <p
                className="uppercase mb-3"
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: 'var(--salon-muted, #999)',
                }}
              >
                Location
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '13px',
                  color: 'var(--salon-ink, #1a1a1a)',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.7,
                }}
              >
                {address}
              </p>
            </div>
          )}
          {hours && (
            <div className="text-left md:text-center">
              <p
                className="uppercase mb-3"
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: 'var(--salon-muted, #999)',
                }}
              >
                Hours
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '13px',
                  color: 'var(--salon-ink, #1a1a1a)',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.7,
                }}
              >
                {hours}
              </p>
            </div>
          )}
          {phone && (
            <div className="text-left md:text-center">
              <p
                className="uppercase mb-3"
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: 'var(--salon-muted, #999)',
                }}
              >
                Contact
              </p>
              <a
                href={`tel:${phone}`}
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '13px',
                  color: 'var(--salon-ink, #1a1a1a)',
                  textDecoration: 'none',
                  borderBottom: '1px solid transparent',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--salon-ink, #1a1a1a)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
              >
                {phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
