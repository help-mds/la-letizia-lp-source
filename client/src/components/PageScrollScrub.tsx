import { useEffect, useRef, useCallback, useState, type ReactNode } from 'react';
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
 * as the user scrolls. 400svh total scroll length.
 *
 * Enhanced with:
 * - Smooth lerp interpolation (no jitter/stutter)
 * - Stylish "scroll" indicator at bottom center
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
  const animFrameRef = useRef<number | null>(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const lastDrawnFrame = useRef(-1);
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true);

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

  // Smooth lerp animation loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    const LERP_FACTOR = 0.12; // Smoothness (lower = smoother but slower)

    const tick = () => {
      // Lerp current toward target
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgress.current += diff * LERP_FACTOR;
      } else {
        currentProgress.current = targetProgress.current;
      }

      // Only redraw if frame index changed
      const frameIndex = Math.round(currentProgress.current * (activeCount - 1));
      if (frameIndex !== lastDrawnFrame.current) {
        lastDrawnFrame.current = frameIndex;
        const frame = getFrameAt(currentProgress.current);
        if (frame) drawFrame(frame);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [prefersReducedMotion, activeCount, getFrameAt, drawFrame]);

  // Scroll handler — just updates target (no RAF coalesce needed, lerp handles smoothing)
  // Supports both window-level scrolling and #root-level scrolling (for hosting environments
  // like SalesKPI that constrain #root with overflow:hidden auto + fixed height)
  const handleScroll = useCallback(() => {
    if (prefersReducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scrollableHeight = container.scrollHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
    targetProgress.current = progress;

    // Hide scroll indicator after user scrolls a bit
    if (progress > 0.05 && scrollIndicatorVisible) {
      setScrollIndicatorVisible(false);
    }
  }, [prefersReducedMotion, scrollIndicatorVisible]);

  // Detect scroll target: window or a constrained parent (e.g., #root with overflow:auto)
  const getScrollTarget = useCallback((): HTMLElement | Window => {
    const root = document.getElementById('root');
    if (root) {
      const style = getComputedStyle(root);
      const hasConstrainedHeight = root.scrollHeight > root.clientHeight &&
        (style.overflow === 'auto' || style.overflow === 'hidden auto' ||
         style.overflowY === 'auto' || style.overflowY === 'scroll');
      if (hasConstrainedHeight) return root;
    }
    return window;
  }, []);

  // Attach scroll listener to the appropriate target
  useEffect(() => {
    const target = getScrollTarget();
    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, getScrollTarget]);

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

        {/* Scroll indicator — stylish, bottom center */}
        {ready && !loaderActive && scrollIndicatorVisible && (
          <div className="hero-scroll-indicator">
            <span className="hero-scroll-indicator-text">SCROLL</span>
            <div className="hero-scroll-indicator-line" />
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
