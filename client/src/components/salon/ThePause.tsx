import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ThePauseProps {
  images: string[]; // 2 detail images
  text?: string;
}

/**
 * The Pause — A moment of stillness before the work begins.
 * Detail photos (towel texture, tea, products) with subtle parallax offset.
 * Kinetic typography: small, quiet text that drifts upward.
 */
export default function ThePause({ images, text }: ThePauseProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Parallax offset on images
      const imgs = section.querySelectorAll<HTMLElement>('.pause-img');
      imgs.forEach((img, i) => {
        gsap.fromTo(
          img,
          { y: i % 2 === 0 ? 30 : -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: img,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        );

        // Subtle parallax drift while in view
        gsap.to(img, {
          y: i % 2 === 0 ? -15 : 10,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });

      // Kinetic text — slow drift upward
      const textEl = section.querySelector<HTMLElement>('.pause-text');
      if (textEl) {
        gsap.fromTo(
          textEl,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textEl,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, [images]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        padding: 'clamp(80px, 12vw, 160px) var(--gutter)',
        backgroundColor: 'var(--salon-bg, #fafaf9)',
      }}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Asymmetric image layout */}
        <div className="grid grid-cols-12 gap-6 md:gap-8 items-start">
          {images[0] && (
            <div className="col-span-12 md:col-span-5 md:col-start-1 pause-img" style={{ opacity: 0 }}>
              <div className="overflow-hidden" style={{ borderRadius: '2px' }}>
                <img
                  src={images[0]}
                  alt=""
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '3/4' }}
                />
              </div>
            </div>
          )}
          {images[1] && (
            <div className="col-span-12 md:col-span-4 md:col-start-8 md:mt-[8vh] pause-img" style={{ opacity: 0 }}>
              <div className="overflow-hidden" style={{ borderRadius: '2px' }}>
                <img
                  src={images[1]}
                  alt=""
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '4/5' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Kinetic text */}
        {text && (
          <p
            className="pause-text mt-12 md:mt-20 text-center max-w-[540px] mx-auto"
            style={{
              fontFamily: 'var(--salon-font-heading, "Fraunces", serif)',
              fontSize: 'clamp(17px, 2.2vw, 26px)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'var(--salon-ink, #1a1a1a)',
              opacity: 0,
            }}
          >
            {text}
          </p>
        )}
      </div>
    </section>
  );
}
