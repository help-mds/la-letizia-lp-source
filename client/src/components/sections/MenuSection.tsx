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
 * Premium editorial menu section.
 * White base, generous whitespace, hairline dividers, stagger-list animation.
 * Uses data-reveal and data-stagger-list for PageTransitions choreography.
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
        <header data-reveal style={{ marginBottom: 'var(--space-section)' }}>
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
        <div
          data-stagger-list
          className="flex flex-col"
          style={{
            borderTop: '1px solid rgba(26, 23, 20, 0.08)',
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="group grid grid-cols-[1fr_auto] items-baseline gap-8 transition-all duration-300"
              style={{
                padding: 'clamp(20px, 3vh, 32px) 0',
                borderBottom: '1px solid rgba(26, 23, 20, 0.08)',
              }}
            >
              {/* Left: name + description */}
              <div className="flex flex-col gap-2">
                <span
                  className="transition-transform duration-300 group-hover:translate-x-2"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2,
                  }}
                >
                  {item.name}
                </span>
                {item.desc && (
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--fs-body)',
                      color: 'rgba(26, 23, 20, 0.55)',
                      lineHeight: 1.6,
                      maxWidth: '48ch',
                    }}
                  >
                    {item.desc}
                  </span>
                )}
              </div>

              {/* Right: price */}
              {item.price && (
                <span
                  className="shrink-0 tabular-nums"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'calc(var(--fs-body) + 1px)',
                    color: 'rgba(26, 23, 20, 0.65)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {item.price}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
