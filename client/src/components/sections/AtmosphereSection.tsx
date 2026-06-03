import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * AtmosphereSection — Awwwards-level immersive section.
 *
 * Architecture:
 * - Outer wrapper: 250vh tall (provides scroll runway)
 * - Sticky image layer: stays fixed at top while user scrolls
 * - clip-path reveal: image wipes in via scroll scrub
 * - Text layer: positioned at bottom, scrolls up naturally as user scrolls past
 * - Kinetic typography: words appear with y + blur stagger
 *
 * The section is 250vh tall. The image is sticky (100vh).
 * As user scrolls through the 250vh:
 *   - First 60%: clip-path reveals the image from bottom
 *   - 55-85%: text words animate in with kinetic stagger
 *   - After reveal: text naturally scrolls up and out of view
 */
export default function AtmosphereSection({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imageWrap = imageRef.current;
    const wordsContainer = wordsContainerRef.current;
    const eyebrow = eyebrowRef.current;
    const textBlock = textBlockRef.current;
    if (!section || !imageWrap || !wordsContainer || !eyebrow || !textBlock) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      imageWrap.style.clipPath = 'inset(0)';
      const words = wordsContainer.querySelectorAll<HTMLElement>('.atm-word');
      words.forEach((w) => {
        w.style.opacity = '1';
        w.style.transform = 'none';
        w.style.filter = 'none';
      });
      eyebrow.style.opacity = '1';
      textBlock.style.opacity = '1';
      return;
    }

    const triggers: ScrollTrigger[] = [];
    const tweens: gsap.core.Tween[] = [];
    const timelines: gsap.core.Timeline[] = [];

    // Image reveal: clip-path wipe from bottom (scrub-linked)
    gsap.set(imageWrap, { clipPath: 'inset(100% 0 0 0)' });
    const revealTween = gsap.to(imageWrap, {
      clipPath: 'inset(0% 0 0 0)',
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: section,
        start: 'top 20%',
        end: 'top -40%',
        scrub: 0.6,
      },
    });
    tweens.push(revealTween);
    if (revealTween.scrollTrigger) triggers.push(revealTween.scrollTrigger);

    // Image parallax (subtle upward drift)
    const img = imageWrap.querySelector('img');
    if (img) {
      const parallaxTween = gsap.fromTo(
        img,
        { y: '6%' },
        {
          y: '-3%',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );
      tweens.push(parallaxTween);
      if (parallaxTween.scrollTrigger) triggers.push(parallaxTween.scrollTrigger);
    }

    // Text block: starts hidden, fades in, then scrolls up naturally
    gsap.set(textBlock, { opacity: 0 });
    const words = wordsContainer.querySelectorAll<HTMLElement>('.atm-word');
    gsap.set(words, { opacity: 0, y: 40, filter: 'blur(12px)' });
    gsap.set(eyebrow, { opacity: 0, y: 10 });

    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top -20%',
        end: 'top -45%',
        scrub: 0.4,
      },
    });

    // Fade in the text block container
    textTl.to(textBlock, {
      opacity: 1,
      duration: 0.2,
    });

    // Eyebrow appears
    textTl.to(eyebrow, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    }, '<');

    // Words stagger in with blur dissolve
    textTl.to(words, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.08,
    }, '-=0.1');

    timelines.push(textTl);
    if (textTl.scrollTrigger) triggers.push(textTl.scrollTrigger);

    // Text scrolls up and fades out as user continues scrolling
    // Increased gap between text-in and text-out so text stays visible longer
    const textExitTween = gsap.to(textBlock, {
      y: '-40vh',
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top -120%',
        end: 'top -180%',
        scrub: 0.5,
      },
    });
    tweens.push(textExitTween);
    if (textExitTween.scrollTrigger) triggers.push(textExitTween.scrollTrigger);

    return () => {
      triggers.forEach((t) => t.kill());
      tweens.forEach((t) => t.kill());
      timelines.forEach((t) => t.kill());
    };
  }, []);

  // Split caption into words for kinetic animation
  const words = caption.split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        /* Tall section provides scroll runway for all animations */
        height: '320vh',
        /* Overlap the dark bridge */
        marginTop: '-15vh',
        zIndex: 1,
      }}
    >
      {/* Sticky image container — stays fixed while user scrolls */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: '100vh',
          backgroundColor: '#0E0D0C',
        }}
      >
        {/* Image layer with clip-path reveal */}
        <div
          ref={imageRef}
          className="absolute inset-0"
          style={{
            clipPath: 'inset(100% 0 0 0)',
            willChange: 'clip-path',
          }}
        >
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ willChange: 'transform' }}
          />
        </div>

        {/* Dark vignette overlay for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom, rgba(14,13,12,0.2) 0%, transparent 30%),
              linear-gradient(to top, rgba(14,13,12,0.65) 0%, transparent 50%)
            `,
            zIndex: 2,
          }}
        />

        {/* Text content — bottom-left editorial, scrolls up */}
        <div
          ref={textBlockRef}
          className="absolute bottom-0 left-0 right-0"
          style={{
            padding: 'var(--gutter)',
            paddingBottom: 'clamp(48px, 10vh, 120px)',
            zIndex: 3,
            willChange: 'transform, opacity',
          }}
        >
          <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
            {/* Eyebrow */}
            <p
              ref={eyebrowRef}
              className="uppercase"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-eyebrow)',
                letterSpacing: '0.32em',
                color: 'rgba(255,255,255,0.55)',
                marginBottom: '20px',
              }}
            >
              Atmosphere
            </p>

            {/* Kinetic caption — each word is a separate span */}
            <div
              ref={wordsContainerRef}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.15,
                color: 'rgba(255,255,255,0.92)',
                maxWidth: '16ch',
              }}
            >
              {words.map((word, i) => (
                <span
                  key={i}
                  className="atm-word inline-block mr-[0.3em]"
                  style={{ willChange: 'transform, opacity, filter' }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
