/**
 * Minimal editorial footer.
 * Hairline top border, store name centered, year.
 */
export default function FooterSection({
  storeName = 'La Letizia',
}: {
  storeName?: string;
}) {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: 'var(--bg)',
        padding: 'calc(var(--space-block) * 2) var(--gutter)',
        borderTop: '1px solid rgba(26, 23, 20, 0.06)',
      }}
    >
      <div
        className="mx-auto flex flex-col items-center gap-4"
        style={{ maxWidth: 'var(--maxw)' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(26, 23, 20, 0.4)',
            letterSpacing: '-0.01em',
          }}
        >
          {storeName}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'rgba(26, 23, 20, 0.25)',
            textTransform: 'uppercase',
          }}
        >
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
