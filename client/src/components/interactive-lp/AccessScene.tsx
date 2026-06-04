interface AccessSceneProps {
  address: string;
  hours: string;
  accessNote?: string;
  mapsUrl?: string;
  mapsEmbedUrl?: string;
}

/**
 * AccessScene: Scene 4 (Visit/Access).
 * Dark gradient background with address, hours, and embedded Google Map.
 * Responsive: side-by-side on desktop, stacked on portrait mobile.
 */
export default function AccessScene({
  address,
  hours,
  accessNote,
  mapsUrl,
  mapsEmbedUrl,
}: AccessSceneProps) {
  const addressLines = address.split('\n');
  const hoursLines = hours.split('\n');

  return (
    <div
      className="scene-access-wrap absolute inset-0 flex flex-col md:flex-row"
      style={{ background: '#FBFAF8' }}
    >
      {/* Left/Top: Info */}
      <div className="scene-access-left flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-16 pt-14 md:pt-0">
        <div
          style={{
            fontSize: '9px',
            letterSpacing: '0.4em',
            opacity: 0.5,
            marginBottom: '10px',
            color: '#1a1a1a',
            textTransform: 'uppercase',
          }}
        >
          VISIT
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading, "Cormorant Garamond", Georgia, serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 3.5vw, 28px)',
            fontWeight: 400,
            marginBottom: '18px',
            color: '#1a1a1a',
          }}
        >
          {addressLines[0] || 'Find Us'}
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div className="scene-access-label">Address</div>
          {addressLines.map((line, i) => (
            <div key={i} className="scene-access-detail">{line}</div>
          ))}
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div className="scene-access-label">Hours</div>
          {hoursLines.map((line, i) => (
            <div key={i} className="scene-access-detail">{line}</div>
          ))}
        </div>

        {accessNote && (
          <div>
            <div className="scene-access-label">Access</div>
            <div className="scene-access-detail">{accessNote}</div>
          </div>
        )}
      </div>

      {/* Right/Bottom: Embedded Google Map */}
      <div className="scene-access-right flex-1 flex items-center justify-center p-4 sm:p-8">
        {mapsEmbedUrl ? (
          <div className="scene-map-embed">
            <iframe
              src={mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            />
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="scene-map-open-link"
              >
                Open in Google Maps
              </a>
            )}
          </div>
        ) : (
          <a
            href={mapsUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="scene-map-link"
            aria-label="Open in Google Maps"
          >
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.18em',
                opacity: 0.7,
                marginTop: '8px',
                textTransform: 'uppercase',
              }}
            >
              OPEN MAP
            </div>
            <div
              style={{
                fontSize: '8px',
                opacity: 0.4,
                marginTop: '4px',
              }}
            >
              Google Maps
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
