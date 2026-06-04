import { useEffect, useRef, useCallback } from 'react';
import { useFrameLoader } from '@/hooks/useFrameLoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DetailSectionProps {
  /** Array of frame URLs for the vertical descent video */
  frameUrls: string[];
  /** Caption text displayed over the video */
  caption?: string;
}

/**
 * Detail Section — Vertical video scrub (top-down descent into dish)
 *
 * Reuses useFrameLoader for frame management.
 * GSAP ScrollTrigger Pin + scrub drives the frame progression.
 * 400svh scroll runway.
 */
export default function DetailSection({ frameUrls, caption = 'The Cut' }: DetailSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const rafId = useRef<number | null>(null);

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

      // Cover-fit calculation
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

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=400vh',
      pin: true,
      scrub: 0.3,
      anticipatePin: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        if (rafId.current === null) {
          rafId.current = requestAnimationFrame(() => {
            const frame = getFrameAt(progressRef.current);
            if (frame) drawFrame(frame);
            rafId.current = null;
          });
        }
      },
    });

    return () => {
      trigger.kill();
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [ready, getFrameAt, drawFrame]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        height: '100vh',
        backgroundColor: '#0E0D0C',
      }}
      id="detail"
    >
      {/* Canvas for frame rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, rgba(14,13,12,0.3) 0%, transparent 30%),
            linear-gradient(to top, rgba(14,13,12,0.7) 0%, transparent 40%)
          `,
          zIndex: 2,
        }}
      />

      {/* Caption — bottom center */}
      <div
        className="absolute bottom-0 left-0 right-0 text-center pointer-events-none"
        style={{
          padding: 'var(--gutter)',
          paddingBottom: 'clamp(48px, 10vh, 100px)',
          zIndex: 3,
        }}
      >
        <p
          className="uppercase"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-eyebrow)',
            letterSpacing: '0.32em',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '12px',
          }}
        >
          Detail
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.1,
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {caption}
        </h2>
      </div>
    </section>
  );
}
