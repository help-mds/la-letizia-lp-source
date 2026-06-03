import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SalonArrivalProps {
  imageUrl: string;
  caption?: string;
}

/**
 * Arrival — The space reveals itself.
 * Full-width image fades in with a slow, deliberate entrance.
 * Luxury: 3s fade. Casual: 1.5s.
 */
export default function SalonArrival({ imageUrl, caption }: SalonArrivalProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;

    const ctx = gsap.context(() => {
      // Image fade-in on scroll enter
      gsap.fromTo(
        image,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        },
      );

      // Caption reveal — delayed
      if (captionRef.current) {
        gsap.fromTo(
          captionRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: captionRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, [imageUrl]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        padding: 'clamp(60px, 10vw, 140px) var(--gutter)',
        backgroundColor: 'var(--salon-bg, #fafaf9)',
      }}
    >
      <div
        ref={imageRef}
        className="relative w-full max-w-[1200px] mx-auto overflow-hidden"
        style={{ opacity: 0, borderRadius: '2px' }}
      >
        <img
          src={imageUrl}
          alt="Salon space"
          className="w-full h-auto object-cover"
          style={{ aspectRatio: '16/10' }}
        />
      </div>

      {caption && (
        <p
          ref={captionRef}
          className="mt-8 md:mt-10 text-center"
          style={{
            fontFamily: '"Fraunces", serif',
            fontSize: 'clamp(15px, 1.8vw, 20px)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'var(--salon-ink, #1a1a1a)',
            opacity: 0,
            letterSpacing: '0.02em',
          }}
        >
          {caption}
        </p>
      )}
    </section>
  );
}
