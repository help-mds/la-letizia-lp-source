import { useEffect, useRef, useCallback } from 'react';

interface TheWorkProps {
  images: string[]; // 3-4 macro close-ups (faceless)
  motionScale?: number; // luxury: 0.8 (slower), casual: 1.2 (faster)
}

/**
 * The Work — The main event. Macro close-ups revealed one by one.
 * Each image appears through a circle clip-path that expands from center.
 *
 * Architecture (same as ScrollAnimatedHero):
 * - Outer div: tall container (height = panels * 200vh)
 * - Inner sticky div: 100svh viewport
 * - Scroll progress drives circle clip-path expansion
 * - Last image holds for 25% of total scroll before section ends
 *
 * No GSAP pin — uses CSS sticky for reliable timing with Lenis.
 */
export default function TheWork({ images, motionScale = 0.8 }: TheWorkProps) {
  const containerRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const labelRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Total scroll runway — generous for slow reveals
  const vhPerPanel = 200;
  const totalScrollVh = images.length * vhPerPanel;

  const updatePanels = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scrollableHeight = container.scrollHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

    const panels = panelsRef.current.filter(Boolean);
    if (panels.length === 0) return;

    // Reserve 25% at end as HOLD on last image
    const holdRatio = 0.25;
    const animRange = 1 - holdRatio;

    // Each panel (except first) gets a reveal zone
    const numReveals = panels.length - 1;
    if (numReveals <= 0) return;

    const revealSlice = animRange / numReveals;

    panels.forEach((panel, i) => {
      if (i === 0) {
        // First panel is always fully visible
        panel.style.clipPath = 'circle(100% at 50% 50%)';
        return;
      }

      // Each subsequent panel reveals during its slice
      const revealStart = revealSlice * (i - 1);
      const revealEnd = revealStart + revealSlice * 0.75; // 75% of slice for reveal

      let clipPercent: number;
      if (progress <= revealStart) {
        clipPercent = 0;
      } else if (progress >= revealEnd) {
        clipPercent = 80;
      } else {
        const revealProgress = (progress - revealStart) / (revealEnd - revealStart);
        // Ease in-out for smooth reveal
        const eased = revealProgress < 0.5
          ? 2 * revealProgress * revealProgress
          : 1 - Math.pow(-2 * revealProgress + 2, 2) / 2;
        clipPercent = eased * 80;
      }

      panel.style.clipPath = `circle(${clipPercent}% at 50% 50%)`;

      // Subtle zoom on the image inside
      const img = panel.querySelector('img') as HTMLElement;
      if (img) {
        const zoomProgress = Math.max(0, Math.min(1, (progress - revealStart) / revealSlice));
        const scale = 1.06 - zoomProgress * 0.06; // 1.06 → 1.0
        img.style.transform = `scale(${scale})`;
      }
    });

    // Label fade in when scrolled past 10%
    if (labelRef.current) {
      const labelOpacity = progress > 0.1 ? 1 : 0;
      labelRef.current.style.opacity = String(labelOpacity);
    }
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        updatePanels();
      });
    };

    // Initial render
    updatePanels();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [updatePanels]);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${totalScrollVh}svh` }}
    >
      {/* Sticky viewport */}
      <div
        className="sticky top-0 w-full h-[100svh] overflow-hidden"
        style={{ backgroundColor: '#111110' }}
      >
        {/* Stacked panels */}
        {images.map((src, i) => (
          <div
            key={i}
            ref={(el) => { if (el) panelsRef.current[i] = el; }}
            className="absolute inset-0 w-full h-full"
            style={{
              zIndex: i + 1,
              clipPath: i === 0 ? 'circle(100% at 50% 50%)' : 'circle(0% at 50% 50%)',
            }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            {/* Subtle vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.35) 100%)',
              }}
            />
          </div>
        ))}

        {/* Section label */}
        <div
          ref={labelRef}
          className="absolute bottom-10 left-[var(--gutter)] z-20 pointer-events-none"
          style={{ opacity: 0, transition: 'opacity 0.8s ease' }}
        >
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            The Work
          </p>
        </div>
      </div>
    </section>
  );
}
