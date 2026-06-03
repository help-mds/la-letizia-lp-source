/**
 * AtmosphereSection — Premium editorial immersive image section.
 * Full-viewport height, parallax image with overlay gradient,
 * editorial caption with large serif typography.
 */
export default function AtmosphereSection({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption: string;
}) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', minHeight: '600px' }}
    >
      {/* Parallax image */}
      <div
        data-parallax
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Gradient overlays for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(26,23,20,0.08) 0%, transparent 40%, rgba(26,23,20,0.45) 100%)',
        }}
      />

      {/* Caption — bottom-left editorial placement */}
      <div
        data-reveal
        className="absolute bottom-0 left-0 right-0"
        style={{ padding: 'var(--gutter)', paddingBottom: 'clamp(48px, 8vh, 96px)' }}
      >
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.32em',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '16px',
            }}
          >
            Atmosphere
          </p>
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.1,
              color: 'rgba(255,255,255,0.92)',
              maxWidth: '18ch',
            }}
          >
            {caption}
          </p>
        </div>
      </div>
    </section>
  );
}
