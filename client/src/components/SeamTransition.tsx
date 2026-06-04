import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type TransitionType = 'blackflash' | 'crossfade' | 'mask';

interface SeamTransitionProps {
  /** Transition pattern: A=blackflash, B=crossfade, C=mask */
  type: TransitionType;
  /** Text shown during blackflash (type A only) */
  flashText?: string;
}

/**
 * Seam-killing transitions between sections.
 *
 * A. Black Flash — brief blackout with large typo flash (600-800ms scroll range)
 *    Section A last → opacity 1→0, bg #000 visible
 *    During blackout: large typo flashes center (opacity 0→1→0)
 *    Section B first → opacity 0→1
 *
 * B. Crossfade — overlapping opacity transition (400ms)
 *    Section A → opacity 1→0 simultaneous with Section B → opacity 0→1
 *    Implemented as a negative-margin overlap zone with gradient blending
 *
 * C. Mask — clip-path wipe from bottom (600ms)
 *    Section A stays fixed, Section B reveals via clip-path: inset(100% 0 0 0) → inset(0)
 *    Implemented as a scroll-driven clip-path animation on the next section
 *
 * Place this component BETWEEN two sections.
 */
export default function SeamTransition({ type, flashText = '' }: SeamTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const triggers: ScrollTrigger[] = [];

    if (type === 'blackflash') {
      // A: Black flash with text
      gsap.set(el, { opacity: 1 });
      if (textRef.current) gsap.set(textRef.current, { opacity: 0, scale: 0.95 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.3,
        },
      });

      if (textRef.current) {
        tl.to(textRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' })
          .to(textRef.current, { opacity: 0, scale: 1.05, duration: 0.4, ease: 'power2.in' }, '+=0.15');
      }
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);

      // Fade out previous section as we enter the blackout
      const prevSection = el.previousElementSibling as HTMLElement | null;
      const nextSection = el.nextElementSibling as HTMLElement | null;

      if (prevSection) {
        const prevTl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            end: 'top 65%',
            scrub: 0.3,
          },
        });
        prevTl.to(prevSection, { opacity: 0, ease: 'power1.in' });
        if (prevTl.scrollTrigger) triggers.push(prevTl.scrollTrigger);
      }

      // Fade in next section as we exit the blackout
      if (nextSection) {
        gsap.set(nextSection, { opacity: 0 });
        const nextTl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'bottom 55%',
            end: 'bottom 25%',
            scrub: 0.3,
          },
        });
        nextTl.to(nextSection, { opacity: 1, ease: 'power1.out' });
        if (nextTl.scrollTrigger) triggers.push(nextTl.scrollTrigger);
      }
    } else if (type === 'crossfade') {
      // B: Crossfade — overlap zone where prev fades out and next fades in simultaneously
      const prevSection = el.previousElementSibling as HTMLElement | null;
      const nextSection = el.nextElementSibling as HTMLElement | null;

      if (prevSection && nextSection) {
        // Fade out previous section
        const prevTl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.3,
          },
        });
        prevTl.to(prevSection, { opacity: 0, ease: 'power1.inOut' });
        if (prevTl.scrollTrigger) triggers.push(prevTl.scrollTrigger);

        // Fade in next section
        gsap.set(nextSection, { opacity: 0 });
        const nextTl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 0.3,
          },
        });
        nextTl.to(nextSection, { opacity: 1, ease: 'power1.inOut' });
        if (nextTl.scrollTrigger) triggers.push(nextTl.scrollTrigger);
      }
    } else if (type === 'mask') {
      // C: Mask transition — next section reveals via clip-path wipe from bottom
      const nextSection = el.nextElementSibling as HTMLElement | null;

      if (nextSection) {
        // Set initial clip-path: completely hidden (clipped from bottom)
        gsap.set(nextSection, { clipPath: 'inset(100% 0 0 0)' });

        const maskTl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
            end: 'top 10%',
            scrub: 0.4,
          },
        });
        maskTl.to(nextSection, {
          clipPath: 'inset(0% 0 0 0)',
          ease: 'power2.inOut',
          duration: 1,
        });
        if (maskTl.scrollTrigger) triggers.push(maskTl.scrollTrigger);
      }
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [type, flashText]);

  if (type === 'blackflash') {
    return (
      <div
        ref={ref}
        className="relative w-full flex items-center justify-center"
        style={{
          height: 'clamp(250px, 40vh, 400px)',
          backgroundColor: '#000',
          zIndex: 5,
        }}
      >
        {flashText && (
          <p
            ref={textRef}
            className="uppercase text-center"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.75)',
              willChange: 'transform, opacity',
            }}
          >
            {flashText}
          </p>
        )}
      </div>
    );
  }

  if (type === 'crossfade') {
    return (
      <div
        ref={ref}
        className="relative w-full"
        style={{
          height: 'clamp(80px, 15vh, 160px)',
          background: 'linear-gradient(to bottom, #0E0D0C, #0E0D0C)',
          marginTop: '-40px',
          marginBottom: '-40px',
          zIndex: 3,
        }}
      />
    );
  }

  if (type === 'mask') {
    return (
      <div
        ref={ref}
        className="relative w-full"
        style={{
          height: 'clamp(40px, 8vh, 80px)',
          backgroundColor: 'transparent',
        }}
      />
    );
  }

  return null;
}
