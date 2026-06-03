import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TransformationProps {
  imageUrl: string; // The "after" — finished hair/nails, faceless
  caption?: string;
}

/**
 * Transformation — The reveal of the finished work.
 * A horizontal wipe mask (left → right) reveals the final image.
 * Bright, airy. The moment of satisfaction.
 */
export default function Transformation({ imageUrl, caption }: TransformationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imageWrap = imageWrapRef.current;
    if (!section || !imageWrap) return;

    const ctx = gsap.context(() => {
      // Horizontal wipe reveal — smooth scrubbed
      gsap.fromTo(
        imageWrap,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            end: 'top 15%',
            scrub: 1.2,
          },
        },
      );

      // Caption fade
      if (captionRef.current) {
        gsap.fromTo(
          captionRef.current,
          { opacity: 0, y: 16 },
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
        padding: 'clamp(80px, 12vw, 160px) 0',
        backgroundColor: 'var(--salon-bg, #fafaf9)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-[var(--gutter)]">
        {/* Image with wipe reveal */}
        <div
          ref={imageWrapRef}
          className="relative w-full overflow-hidden"
          style={{ borderRadius: '2px', clipPath: 'inset(0 100% 0 0)' }}
        >
          <img
            src={imageUrl}
            alt="Transformation result"
            className="w-full h-auto object-cover"
            style={{ aspectRatio: '16/10' }}
          />
        </div>

        {/* Caption */}
        {caption && (
          <p
            ref={captionRef}
            className="mt-10 md:mt-14 text-center max-w-[600px] mx-auto"
            style={{
              fontFamily: 'var(--salon-font-heading, "Fraunces", serif)',
              fontSize: 'clamp(16px, 2vw, 24px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--salon-ink, #1a1a1a)',
              opacity: 0,
              letterSpacing: '0.01em',
              lineHeight: 1.5,
            }}
          >
            {caption}
          </p>
        )}
      </div>
    </section>
  );
}
