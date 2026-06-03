import { useEffect, useRef, useState } from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  phone?: string;
}

/**
 * CTA section styled as cinematic end credits.
 * Black background, large serif typography, fade-in on scroll.
 * "OPEN BY APPOINTMENT" / "RESERVATIONS / +971..."
 * Fade out at the end like a movie credit roll.
 */
export default function CtaSection({
  title = 'Your table is waiting',
  subtitle,
  buttonText = 'Reserve',
  buttonHref = '#',
  phone,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="w-full flex items-center justify-center"
      style={{
        backgroundColor: 'var(--ink)',
        minHeight: '100vh',
        padding: 'var(--space-section) var(--gutter)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--maxw)',
          margin: '0 auto',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1.2s cubic-bezier(0.23, 1, 0.32, 1), transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {/* Title - large serif italic */}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--overlay-text)',
            lineHeight: 1.0,
            marginBottom: '2rem',
          }}
        >
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-body)',
              color: 'rgba(242, 238, 232, 0.6)',
              maxWidth: '42ch',
              margin: '0 auto 3rem',
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Reserve button */}
        <a
          href={buttonHref}
          className="inline-block"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-eyebrow)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
            backgroundColor: 'var(--overlay-text)',
            padding: '16px 56px',
            transition: 'opacity 0.3s ease, transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.opacity = '0.9';
            (e.target as HTMLElement).style.transform = 'scale(0.98)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.opacity = '1';
            (e.target as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          {buttonText}
        </a>

        {/* Phone number if available */}
        {phone && (
          <p
            className="mt-10"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '0.2em',
              color: 'rgba(242, 238, 232, 0.4)',
            }}
          >
            RESERVATIONS &middot;{' '}
            <a
              href={`tel:${phone}`}
              style={{ color: 'rgba(242, 238, 232, 0.6)', textDecoration: 'none' }}
            >
              {phone}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
