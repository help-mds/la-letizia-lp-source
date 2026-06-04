import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { useFrameLoader } from '@/hooks/useFrameLoader';

interface Props {
  /** Public URL prefix for frames (landscape). */
  framesPath?: string;
  /** Array of full frame URLs (alternative to framesPath). */
  frameUrls?: string[];
  /** Total frame count (landscape). */
  frameCount: number;
  /** Portrait frames path (optional, for mobile). */
  framesPathPortrait?: string;
  /** Portrait frame URLs (optional). */
  frameUrlsPortrait?: string[];
  /** Portrait frame count (optional). */
  frameCountPortrait?: number;
  /** Overlay children positioned absolutely within the scroll container. */
  children?: ReactNode;
  /** Optional render prop for a custom loading overlay. Receives (progress, ready). */
  renderLoader?: (progress: number, ready: boolean) => ReactNode;
  /** When true, overlay children are hidden (loader is still active). */
  loaderActive?: boolean;
}

/**
 * Full-viewport sticky canvas that scrubs through preloaded WebP frames
 * as the user scrolls. 800svh total scroll length.
 *
 * Faithfully translated from ZIP: components/templates/restaurant/PageScrollScrub.tsx
 *
 * Key features preserved:
 * - RAF coalesce (single rAF per scroll event)
 * - DPR-aware canvas with cover-fit drawing
 * - Orientation switch (landscape/portrait based on viewport)
 * - stride=2 on mobile (load every other frame)
 * - prefers-reduced-motion fallback (shows last frame, no scrub)
 */
export default function PageScrollScrub({
  framesPath,
  frameUrls,
  frameCount,
  framesPathPortrait,
  frameUrlsPortrait,
  frameCountPortrait,
  children,
  renderLoader,
  loaderActive,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId = useRef<number | null>(null);
  const lastProgress = useRef(-1);

  // Determine orientation
  const isPortrait =
    typeof window !== 'undefined' && window.innerWidth < window.innerHeight;

  const activePath = isPortrait && framesPathPortrait ? framesPathPortrait : framesPath;
  const activeUrls = isPortrait && frameUrlsPortrait ? frameUrlsPortrait : frameUrls;
  const activeCount = isPortrait && frameCountPortrait ? frameCountPortrait : frameCount;

  // stride=2 on mobile (< 768px width)
  const stride = typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 1;

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { progress: loadProgress, ready, getFrameAt } = useFrameLoader({
    basePath: activePath,
    frameUrls: activeUrls,
    frameCount: activeCount,
    stride,
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

      // Resize canvas buffer if needed
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
      }

      // Cover-fit calculation
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;

      let sx = 0,
        sy = 0,
        sw = img.naturalWidth,
        sh = img.naturalHeight;

      if (imgRatio > canvasRatio) {
        sw = img.naturalHeight * canvasRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / canvasRatio;
        sy = (img.naturalHeight - sh) / 2;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw * dpr, ch * dpr);
    },
    [],
  );

  // Scroll handler with RAF coalesce
  const handleScroll = useCallback(() => {
    if (prefersReducedMotion) return; // No scrub for reduced motion
    if (rafId.current !== null) return; // coalesce

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableHeight = container.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      if (Math.abs(progress - lastProgress.current) < 0.001) return;
      lastProgress.current = progress;

      const frame = getFrameAt(progress);
      if (frame) drawFrame(frame);
    });
  }, [getFrameAt, drawFrame, prefersReducedMotion]);

  // Attach scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll]);

  // Draw first frame once ready
  useEffect(() => {
    if (ready) {
      const frame = getFrameAt(0);
      if (frame) drawFrame(frame);
    }
  }, [ready, getFrameAt, drawFrame]);

  // Reduced motion: show last frame statically
  useEffect(() => {
    if (prefersReducedMotion && ready) {
      const frame = getFrameAt(1);
      if (frame) drawFrame(frame);
    }
  }, [prefersReducedMotion, ready, getFrameAt, drawFrame]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '400svh' }}
    >
      {/* Sticky canvas viewport */}
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: 'block' }}
        />

        {/* Loading indicator — custom or default */}
        {renderLoader
          ? renderLoader(loadProgress, ready)
          : !ready && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--ink)]">
              <div className="text-center">
                <div className="w-48 h-[2px] bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/80 transition-[width] duration-300 ease-out"
                    style={{ width: `${Math.round(loadProgress * 100)}%` }}
                  />
                </div>
                <p
                  className="mt-3 text-white/60 text-xs tracking-[0.2em] uppercase"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {Math.round(loadProgress * 100)}%
                </p>
              </div>
            </div>
          )}

        {/* Overlay children — always visible inside sticky viewport */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: loaderActive ? 0 : 1, transition: 'opacity 0.6s ease' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
