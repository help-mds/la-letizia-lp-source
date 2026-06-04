import {
  IconCalendar,
  IconPhone,
  IconBrandWhatsapp,
  IconBrandInstagram,
  IconMapPin,
  IconMessageCircle,
} from '@tabler/icons-react';

export interface ReservationChannel {
  type: 'reserve-form' | 'call' | 'whatsapp' | 'instagram' | 'maps' | 'line';
  label: string;
  sublabel?: string;
  url?: string;
}

interface ReservationSceneProps {
  storeName: string;
  channels: ReservationChannel[];
  title?: string;
  subtitle?: string;
  accentColor?: string;
}

const iconMap = {
  'reserve-form': IconCalendar,
  call: IconPhone,
  whatsapp: IconBrandWhatsapp,
  instagram: IconBrandInstagram,
  maps: IconMapPin,
  line: IconMessageCircle,
};

/**
 * ReservationScene: Scene 5 (Reservation).
 * Dark background with 5-channel CTA grid.
 * Primary CTA (reserve form) spans full width.
 */
export default function ReservationScene({
  storeName,
  channels,
  title,
  subtitle,
  accentColor,
}: ReservationSceneProps) {
  const handleClick = (channel: ReservationChannel) => {
    if (channel.url && channel.url !== '#') {
      if (channel.type === 'call') {
        window.location.href = channel.url;
      } else {
        window.open(channel.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const primaryChannel = channels.find((c) => c.type === 'reserve-form');
  const secondaryChannels = channels.filter((c) => c.type !== 'reserve-form');

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      style={{ background: '#0a0a0a' }}
    >
      <div
        style={{
          fontSize: '9px',
          letterSpacing: '0.4em',
          opacity: 0.5,
          marginBottom: '12px',
          color: 'white',
          textTransform: 'uppercase',
        }}
      >
        RESERVATION
      </div>
      <div
        style={{
          fontFamily: 'var(--font-heading, "Cormorant Garamond", Georgia, serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(24px, 4vw, 32px)',
          fontWeight: 400,
          marginBottom: '6px',
          color: 'white',
          textAlign: 'center',
        }}
      >
        {title || 'Your table is waiting'}
      </div>
      <div
        style={{
          fontSize: '11px',
          opacity: 0.6,
          marginBottom: '28px',
          color: 'white',
          textAlign: 'center',
        }}
      >
        {subtitle || `Experience ${storeName} in person`}
      </div>

      {/* CTA Grid */}
      <div className="scene-cta-grid">
        {/* Primary CTA */}
        {primaryChannel && (
          <button
            className="scene-cta-btn scene-cta-btn-primary"
            onClick={() => handleClick(primaryChannel)}
            aria-label={primaryChannel.label}
          >
            <IconCalendar size={20} />
            <span style={{ fontSize: '12px', fontWeight: 500 }}>
              {primaryChannel.label}
            </span>
          </button>
        )}

        {/* Secondary CTAs */}
        {secondaryChannels.map((channel) => {
          const Icon = iconMap[channel.type] || IconMapPin;
          return (
            <button
              key={channel.type}
              className="scene-cta-btn"
              onClick={() => handleClick(channel)}
              aria-label={channel.label}
            >
              <Icon size={18} style={{ opacity: 0.85 }} />
              <div className="scene-cta-btn-text">
                <div className="scene-cta-btn-label">{channel.label}</div>
                {channel.sublabel && (
                  <div className="scene-cta-btn-sub">{channel.sublabel}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
