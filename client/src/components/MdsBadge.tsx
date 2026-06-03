/**
 * MDS Badge - "Designed by MDS" fixed bottom-right badge.
 * Links to MDS web design service page (placeholder URL for now).
 */
export default function MdsBadge() {
  return (
    <a
      href="https://[MDS-WEB-DESIGN-URL-PLACEHOLDER]"
      target="_blank"
      rel="noopener noreferrer"
      className="mds-badge"
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9999,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        height: '28px',
        padding: '0 10px',
        backgroundColor: 'rgba(26, 23, 20, 0.75)',
        backdropFilter: 'blur(8px)',
        borderRadius: '4px',
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: '10px',
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.85';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      Designed by MDS
    </a>
  );
}
