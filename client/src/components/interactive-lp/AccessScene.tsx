import { IconMapPin } from '@tabler/icons-react';

interface AccessSceneProps {
  address: string;
  hours: string;
  accessNote?: string;
  mapsUrl?: string;
}

/**
 * AccessScene: Scene 4 (Visit/Access).
 * Dark gradient background with address, hours, and a map link panel.
 */
export default function AccessScene({
  address,
  hours,
  accessNote,
  mapsUrl,
}: AccessSceneProps) {
  const addressLines = address.split('\n');
  const hoursLines = hours.split('\n');

  return (
    <div
      className="absolute inset-0 flex"
      style={{ background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)' }}
    >
      {/* Left: Info */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-16">
        <div
          style={{
            fontSize: '9px',
            letterSpacing: '0.4em',
            opacity: 0.5,
            marginBottom: '10px',
            color: 'white',
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
            color: 'white',
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

      {/* Right: Map link */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <a
          href={mapsUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="scene-map-link"
          aria-label="Open in Google Maps"
        >
          <IconMapPin size={32} style={{ opacity: 0.6 }} />
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
      </div>
    </div>
  );
}
