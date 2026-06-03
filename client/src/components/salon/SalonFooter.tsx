import { MagneticButton } from '@/components/MagneticButton';

interface SalonFooterProps {
  storeName: string;
}

/**
 * Minimal salon footer — store name, year, MDS attribution.
 */
export default function SalonFooter({ storeName }: SalonFooterProps) {
  return (
    <footer
      className="relative w-full"
      style={{
        padding: 'var(--space-block) var(--gutter)',
        backgroundColor: 'var(--salon-bg, #fafaf9)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Store name */}
        <p
          style={{
            fontFamily: 'var(--salon-font-heading, "Fraunces", serif)',
            fontSize: '14px',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--salon-ink, #1a1a1a)',
          }}
        >
          {storeName}
        </p>

        {/* Year + MDS */}
        <div className="flex items-center gap-6">
          <p
            style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'var(--salon-muted, #888)',
            }}
          >
            &copy; {new Date().getFullYear()}
          </p>
          <MagneticButton as="a" href="https://mds-fund.com" target="_blank" rel="noopener noreferrer" strength={0.15}>
            <span
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--salon-muted, #888)',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--salon-ink, #1a1a1a)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--salon-muted, #888)'; }}
            >
              Designed by MDS
            </span>
          </MagneticButton>
        </div>
      </div>
    </footer>
  );
}
