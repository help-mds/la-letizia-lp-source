import PhraseTitle from '@/components/text/PhraseTitle';

interface MenuItem {
  name: string;
  desc?: string;
  price?: string;
}

interface Props {
  title?: string;
  eyebrow?: string;
  items: MenuItem[];
}

/**
 * Premium editorial menu section — Phase B upgrade.
 * Features:
 * - Large serif numbering (01, 02, 03...)
 * - Full-width hairline dividers
 * - Hover: item name shifts right + accent underline appears
 * - Price in larger tabular-nums with subtle color
 * - Generous vertical rhythm
 * - data-reveal + data-stagger-list for PageTransitions
 */
export default function MenuSection({
  title = 'Menu',
  eyebrow = 'Selection',
  items,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="menu"
      className="relative w-full"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--ink)',
        paddingTop: 'var(--space-section)',
        paddingBottom: 'var(--space-section)',
        paddingLeft: 'var(--gutter)',
        paddingRight: 'var(--gutter)',
      }}
    >
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
        {/* Header */}
        <header data-reveal style={{ marginBottom: 'calc(var(--space-section) * 0.7)' }}>
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.32em',
              color: 'var(--accent)',
              marginBottom: 'calc(var(--space-block) / 2.5)',
            }}
          >
            {eyebrow}
          </p>
          <PhraseTitle>{title}</PhraseTitle>
        </header>

        {/* Menu items — stagger list */}
        <div data-stagger-list className="flex flex-col">
          {items.map((item, i) => (
            <div
              key={i}
              className="group relative"
              style={{
                borderTop: i === 0 ? '1px solid rgba(26, 23, 20, 0.1)' : undefined,
                borderBottom: '1px solid rgba(26, 23, 20, 0.1)',
              }}
            >
              {/* Hover accent line (left edge) */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px] origin-top transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                  backgroundColor: 'var(--accent)',
                  transform: 'scaleY(0)',
                }}
              />
              <style>{`
                .group:hover > div:first-child { transform: scaleY(1) !important; }
              `}</style>

              <div
                className="grid items-baseline transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                  gridTemplateColumns: 'clamp(40px, 5vw, 64px) 1fr auto',
                  gap: 'clamp(12px, 2vw, 24px)',
                  padding: 'clamp(24px, 4vh, 40px) 0',
                  paddingLeft: '0',
                }}
              >
                {/* Number */}
                <span
                  className="self-start transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'rgba(26, 23, 20, 0.25)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Name + description */}
                <div className="flex flex-col gap-2">
                  <span
                    className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-3"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.35rem, 2.8vw, 2rem)',
                      fontWeight: 300,
                      fontStyle: 'italic',
                      letterSpacing: '-0.015em',
                      lineHeight: 1.15,
                    }}
                  >
                    {item.name}
                  </span>
                  {item.desc && (
                    <span
                      className="transition-all duration-500 group-hover:translate-x-3"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--fs-body)',
                        color: 'rgba(26, 23, 20, 0.5)',
                        lineHeight: 1.6,
                        maxWidth: '48ch',
                      }}
                    >
                      {item.desc}
                    </span>
                  )}
                </div>

                {/* Price */}
                {item.price && (
                  <span
                    className="shrink-0 self-start tabular-nums transition-colors duration-300 group-hover:text-[var(--accent)]"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                      color: 'rgba(26, 23, 20, 0.6)',
                      letterSpacing: '0.04em',
                      fontWeight: 500,
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
