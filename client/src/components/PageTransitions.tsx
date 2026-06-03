import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Page-level scroll choreography. Mount once near the bottom of the template tree.
 * Looks for declarative data attributes and wires the relevant scroll-triggered effects:
 *
 *   data-reveal           — fade + slide-up the section's direct children, staggered.
 *   data-paragraph        — single-element opacity reveal (no Y motion).
 *   data-stagger-list     — opacity + y stagger across direct children.
 *   data-parallax         — gentle vertical parallax (desktop only).
 *   data-scale-in         — scale from 0.92 to 1 on scroll enter.
 *   data-horizontal-scroll — horizontal scroll section (pin + scrub).
 *
 * Respects prefers-reduced-motion.
 */
export function PageTransitions() {
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const tweens: gsap.core.Tween[] = [];

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      document.querySelectorAll<HTMLElement>(
        '[data-reveal], [data-paragraph], [data-stagger-list] > *, [data-scale-in]',
      ).forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // 1. Section reveals — fade-up the section's direct children stagger.
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((sec) => {
      const children = Array.from(sec.children) as HTMLElement[];
      if (children.length === 0) return;
      gsap.set(children, { opacity: 0, y: 32 });
      const tw = gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sec,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
      tweens.push(tw);
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    });

    // 2. Per-paragraph opacity reveals (no Y motion — read-friendly).
    gsap.utils.toArray<HTMLElement>('[data-paragraph]').forEach((p) => {
      gsap.set(p, { opacity: 0 });
      const tw = gsap.to(p, {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: p,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
      tweens.push(tw);
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    });

    // 3. Stagger lists — opacity + y on direct children of the container.
    gsap.utils.toArray<HTMLElement>('[data-stagger-list]').forEach((container) => {
      const items = Array.from(container.children) as HTMLElement[];
      if (items.length === 0) return;
      gsap.set(items, { opacity: 0, y: 24 });
      const tw = gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.07,
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
      tweens.push(tw);
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    });

    // 4. Parallax — gentle vertical drift. Desktop only.
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const tw = gsap.fromTo(
          el,
          { y: 30 },
          {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          },
        );
        tweens.push(tw);
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      });
    });

    // 5. Scale-in — elements that scale from 0.92 to 1
    gsap.utils.toArray<HTMLElement>('[data-scale-in]').forEach((el) => {
      gsap.set(el, { opacity: 0, scale: 0.92 });
      const tw = gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
      tweens.push(tw);
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    });

    // 6. Horizontal scroll sections
    gsap.utils.toArray<HTMLElement>('[data-horizontal-scroll]').forEach((section) => {
      const inner = section.querySelector('[data-horizontal-inner]') as HTMLElement;
      if (!inner) return;
      const scrollWidth = inner.scrollWidth - section.clientWidth;
      const tw = gsap.to(inner, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
      });
      tweens.push(tw);
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
      tweens.forEach((t) => t.kill());
      mm.kill();
    };
  }, []);

  return null;
}

/**
 * RevealSection wrapper for backward compatibility.
 */
interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function RevealSection({
  children,
  className = '',
  delay = 0,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 40 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power2.out',
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
