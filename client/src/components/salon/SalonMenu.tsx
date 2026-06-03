import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MenuItem {
  name: string;
  desc?: string;
  price?: string;
}

interface SalonMenuProps {
  title?: string;
  eyebrow?: string;
  items: MenuItem[];
}

/**
 * SalonMenu — editorial menu/services list for salon template.
 * Differentiation from restaurant MenuSection:
 * - Light warm background (not dark)
 * - Fraunces italic headings (not Cormorant Garamond)
 * - Softer dividers, more generous spacing
 * - Subtle scroll-triggered stagger reveal
 * - "Services" language instead of "Menu"
 */
export default function SalonMenu({
  title = 'Services',
  eyebrow = 'Our Rituals',
  items,
}: SalonMenuProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Stagger reveal for menu items
      const menuItems = section.querySelectorAll<HTMLElement>('.salon-menu-item');
      if (menuItems.length === 0) return;

      gsap.set(menuItems, { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(menuItems, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
          });
        },
      });

      // Header reveal
      const header = section.querySelector<HTMLElement>('.salon-menu-header');
      if (header) {
        gsap.set(header, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(header, {
              opacity: 1,
              y: 0,
              duration: 1.0,
              ease: 'power3.out',
            });
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        backgroundColor: '#fafaf9',
        color: '#1a1a1a',
        paddingTop: 'clamp(100px, 14vh, 180px)',
        paddingBottom: 'clamp(100px, 14vh, 180px)',
        paddingLeft: 'var(--gutter, clamp(24px, 5vw, 64px))',
        paddingRight: 'var(--gutter, clamp(24px, 5vw, 64px))',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <header className="salon-menu-header" style={{ marginBottom: 'clamp(60px, 8vh, 100px)' }}>
          <p
            className="uppercase"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.35em',
              color: 'rgba(26, 26, 26, 0.4)',
              marginBottom: '16px',
            }}
          >
            {eyebrow}
          </p>
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 300,
              fontStyle: 'italic',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              color: '#1a1a1a',
            }}
          >
            {title}
          </h2>
        </header>

        {/* Menu items */}
        <div className="flex flex-col">
          {items.map((item, i) => (
            <div
              key={i}
              className="salon-menu-item group"
              style={{
                borderBottom: '1px solid rgba(26, 26, 26, 0.08)',
                padding: 'clamp(28px, 4vh, 44px) 0',
              }}
            >
              <div
                className="grid items-baseline"
                style={{
                  gridTemplateColumns: 'clamp(36px, 4vw, 56px) 1fr auto',
                  gap: 'clamp(12px, 2vw, 20px)',
                }}
              >
                {/* Number */}
                <span
                  style={{
                    fontFamily: '"Fraunces", serif',
                    fontSize: '13px',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'rgba(26, 26, 26, 0.2)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Name + description */}
                <div className="flex flex-col gap-2">
                  <span
                    className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-2"
                    style={{
                      fontFamily: '"Fraunces", serif',
                      fontSize: 'clamp(1.2rem, 2.4vw, 1.7rem)',
                      fontWeight: 300,
                      fontStyle: 'italic',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.2,
                    }}
                  >
                    {item.name}
                  </span>
                  {item.desc && (
                    <span
                      className="transition-all duration-500 group-hover:translate-x-2"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: 'rgba(26, 26, 26, 0.45)',
                        lineHeight: 1.7,
                        maxWidth: '44ch',
                      }}
                    >
                      {item.desc}
                    </span>
                  )}
                </div>

                {/* Price */}
                {item.price && (
                  <span
                    className="shrink-0 self-start tabular-nums"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: 'rgba(26, 26, 26, 0.5)',
                      letterSpacing: '0.04em',
                      fontWeight: 400,
                    }}
                  >
                    {item.price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
