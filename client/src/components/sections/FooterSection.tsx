import { MagneticButton } from '@/components/MagneticButton';

/**
 * Premium minimal footer — Phase B upgrade.
 * Features:
 * - Dark background continuing the dark lower-page flow
 * - Full-width grid with store name, nav links, attribution
 * - Hairline top border
 * - Elegant micro-typography
 * - "Designed by MDS" attribution link
 */
export default function FooterSection({
  storeName = 'La Letizia',
  navLinks,
}: {
  storeName?: string;
  navLinks?: { label: string; href: string }[];
}) {
  const defaultLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Visit', href: '#info' },
    { label: 'Reserve', href: '#cta' },
  ];

  const links = navLinks || defaultLinks;

  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: '#0E0D0C',
        color: 'var(--overlay-text)',
        borderTop: '1px solid rgba(242, 238, 232, 0.06)',
        padding: 'calc(var(--space-block) * 2.5) var(--gutter) calc(var(--space-block) * 2)',
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: 'var(--maxw)' }}
      >
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-8 items-start">
          {/* Store name */}
          <div className="md:col-span-5">
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'rgba(242, 238, 232, 0.7)',
                letterSpacing: '-0.01em',
              }}
            >
              {storeName}
            </p>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-4">
            <nav className="flex flex-wrap gap-x-8 gap-y-3">
              {links.map((link, i) => (
                <MagneticButton key={i} strength={0.2}>
                  <a
                    href={link.href}
                    className="transition-colors duration-200 hover:text-white"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      letterSpacing: '0.08em',
                      color: 'rgba(242, 238, 232, 0.4)',
                    }}
                  >
                    {link.label}
                  </a>
                </MagneticButton>
              ))}
            </nav>
          </div>

          {/* Year + attribution */}
          <div className="md:col-span-3 md:text-right">
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: 'rgba(242, 238, 232, 0.2)',
                textTransform: 'uppercase',
              }}
            >
              {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Bottom attribution */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{
            borderTop: '1px solid rgba(242, 238, 232, 0.04)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: 'rgba(242, 238, 232, 0.2)',
              textTransform: 'uppercase',
            }}
          >
            <a
              href="https://[MDS-WEB-DESIGN-URL-PLACEHOLDER]"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-white/50"
            >
              Designed by MDS
            </a>
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'rgba(242, 238, 232, 0.15)',
            }}
          >
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
