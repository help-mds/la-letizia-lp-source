import PhraseTitle from '@/components/text/PhraseTitle';
import { RevealSection } from '@/components/PageTransitions';

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
 * White-base menu section with eyebrow, title, and item list.
 *
 * Faithfully translated from ZIP: components/sections/MenuSection.tsx
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
      className="w-full"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--ink)',
        padding: 'var(--space-section) var(--gutter)',
      }}
    >
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
        <RevealSection>
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.32em',
              color: 'var(--accent)',
              marginBottom: 'calc(var(--space-block) / 3)',
            }}
          >
            {eyebrow}
          </p>
          <PhraseTitle>{title}</PhraseTitle>
        </RevealSection>

        <div
          className="mt-12 md:mt-16 flex flex-col"
          style={{ gap: 0 }}
        >
          {items.map((item, i) => (
            <RevealSection key={i} delay={i * 0.05}>
              <div
                className="flex items-baseline justify-between py-5 md:py-6"
                style={{
                  borderBottom: '1px solid rgba(26, 23, 20, 0.08)',
                }}
              >
                <div className="flex flex-col gap-1">
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--fs-h3)',
                      fontWeight: 400,
                      fontStyle: 'italic',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item.name}
                  </span>
                  {item.desc && (
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--fs-body)',
                        color: 'rgba(26, 23, 20, 0.6)',
                      }}
                    >
                      {item.desc}
                    </span>
                  )}
                </div>
                {item.price && (
                  <span
                    className="ml-4 shrink-0"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--fs-body)',
                      color: 'rgba(26, 23, 20, 0.7)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {item.price}
                  </span>
                )}
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
