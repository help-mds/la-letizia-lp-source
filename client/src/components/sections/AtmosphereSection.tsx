/**
 * AtmosphereSection — Premium editorial immersive image section.
 * Full-viewport height, parallax image with overlay gradient,
 * editorial caption with large serif typography.
 *
 * The image emerges from darkness: uses a dark top-edge gradient
 * that matches the RestaurantMenuFadeIn bridge's dark background,
 * creating a seamless cinematic reveal where the image materializes
 * from the black.
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
      className="relative w-full"
      style={{
        height: '100vh',
        minHeight: '600px',
        /* Overlap the dark bridge — image emerges from the darkness */
        marginTop: '-15vh',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Image container with clip */}
      <div
        className="absolute inset-0"
        style={{ clipPath: 'inset(0 0 0 0)' }}
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
      </div>

      {/* Top-edge dark mask: image materializes FROM darkness */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: '40%',
          background: `linear-gradient(
            to bottom,
            #0E0D0C 0%,
            rgba(14, 13, 12, 0.85) 25%,
            rgba(14, 13, 12, 0.5) 50%,
            rgba(14, 13, 12, 0.15) 75%,
            transparent 100%
          )`,
          zIndex: 2,
        }}
      />

      {/* Bottom gradient for depth and text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(26,23,20,0.55) 100%)',
          zIndex: 2,
        }}
      />

      {/* Caption — bottom-left editorial placement */}
      <div
        data-reveal
        className="absolute bottom-0 left-0 right-0"
        style={{
          padding: 'var(--gutter)',
          paddingBottom: 'clamp(48px, 8vh, 96px)',
          zIndex: 3,
        }}
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
