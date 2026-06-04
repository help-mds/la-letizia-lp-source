import { useEffect, useRef, useCallback, useState } from 'react';
import { useFrameLoader } from '@/hooks/useFrameLoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface StoryStep {
  number: string;
  title: string;
  subtitle: string;
}

interface StorySectionProps {
  /** Array of frame URLs for horizontal pan video */
  frameUrls: string[];
  /** Steps displayed as kinetic text overlay */
  steps: StoryStep[];
}

/**
 * Story Section — Horizontal video scrub with kinetic text overlay
 *
 * GSAP ScrollTrigger Pin + scrub drives frame progression.
 * Text steps appear/disappear in sequence as scroll progresses.
 * 600svh scroll runway.
 */
export default function StorySection({ frameUrls, steps }: StorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);
  const rafId = useRef<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { ready, getFrameAt } = useFrameLoader({
    frameUrls,
    frameCount: frameUrls.length,
    stride: typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 1,
  });

  // Draw frame onto canvas with cover-fit
  const drawFrame = useCallback(
    (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
      }

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

      if (imgRatio > canvasRatio) {
        sw = img.naturalHeight * canvasRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / canvasRatio;
        sy = (img.naturalHeight - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw * dpr, ch * dpr);
    },
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !ready) return;

    // Draw first frame
    const firstFrame = getFrameAt(0);
    if (firstFrame) drawFrame(firstFrame);

    // Set initial states for steps
    stepsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 });
    });

    const triggers: ScrollTrigger[] = [];

    // Main scroll trigger for video scrub
    const mainTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=600vh',
      pin: true,
      scrub: 0.3,
      anticipatePin: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;

        // Update active step based on progress
        const stepIndex = Math.min(
          Math.floor(self.progress * steps.length),
          steps.length - 1,
        );
        setActiveStep(stepIndex);

        if (rafId.current === null) {
          rafId.current = requestAnimationFrame(() => {
            const frame = getFrameAt(progressRef.current);
            if (frame) drawFrame(frame);
            rafId.current = null;
          });
        }
      },
    });
    triggers.push(mainTrigger);

    // Step text animations
    const stepDuration = 1 / steps.length;
    steps.forEach((_, i) => {
      const el = stepsRef.current[i];
      if (!el) return;

      const startPct = i * stepDuration;
      const endPct = (i + 1) * stepDuration;

      // Fade in
      const inTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: `top+=${startPct * 600}vh top`,
          end: `top+=${(startPct + stepDuration * 0.3) * 600}vh top`,
          scrub: 0.3,
        },
      });
      inTl.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out' });
      if (inTl.scrollTrigger) triggers.push(inTl.scrollTrigger);

      // Fade out (except last)
      if (i < steps.length - 1) {
        const outTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: `top+=${(endPct - stepDuration * 0.3) * 600}vh top`,
            end: `top+=${endPct * 600}vh top`,
            scrub: 0.3,
          },
        });
        outTl.to(el, { opacity: 0, y: -30, ease: 'power2.in' });
        if (outTl.scrollTrigger) triggers.push(outTl.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach((t) => t.kill());
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [ready, getFrameAt, drawFrame, steps]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        height: '100vh',
        backgroundColor: '#0E0D0C',
      }}
      id="story"
    >
      {/* Canvas for frame rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(14,13,12,0.6) 0%, rgba(14,13,12,0.1) 50%, rgba(14,13,12,0.4) 100%),
            linear-gradient(to top, rgba(14,13,12,0.5) 0%, transparent 30%)
          `,
          zIndex: 2,
        }}
      />

      {/* Section label — top left */}
      <div
        className="absolute top-0 left-0 z-10 pointer-events-none"
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
          Our Story
        </p>
      </div>

      {/* Kinetic text steps — left side, vertically centered */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
        style={{
          padding: 'var(--gutter)',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            ref={(el) => { stepsRef.current[i] = el; }}
            className="absolute"
            style={{
              willChange: 'transform, opacity',
            }}
          >
            {/* Step number */}
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '8px',
              }}
            >
              {step.number}
            </p>
            {/* Step title */}
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.05,
                color: 'rgba(255,255,255,0.92)',
                marginBottom: '8px',
              }}
            >
              {step.title}
            </h3>
            {/* Step subtitle */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)',
                letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.5)',
                maxWidth: '24ch',
              }}
            >
              {step.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Progress dots — bottom center */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none flex justify-center gap-3"
        style={{
          padding: 'var(--gutter)',
          paddingBottom: 'clamp(24px, 4vh, 48px)',
        }}
      >
        {steps.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: activeStep === i ? '24px' : '6px',
              height: '6px',
              backgroundColor: activeStep === i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
