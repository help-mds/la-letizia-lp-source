import { RevealSection } from '@/components/PageTransitions';

interface Props {
  images: string[];
  eyebrow?: string;
}

/**
 * Gallery section with a responsive grid of images.
 *
 * Faithfully translated from ZIP: components/sections/GallerySection.tsx
 */
export default function GallerySection({
  images,
  eyebrow = 'Gallery',
}: Props) {
  if (images.length === 0) return null;

  return (
    <section
      id="gallery"
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
            className="uppercase mb-8 md:mb-12"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: '0.32em',
              color: 'var(--accent)',
            }}
          >
            {eyebrow}
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {images.map((src, i) => (
            <RevealSection key={i} delay={i * 0.08}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
