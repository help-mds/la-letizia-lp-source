import { useEffect, useRef, useState } from "react";
import { RevealSection } from "@/components/PageTransitions";

interface GalleryItem {
  src: string;
  caption?: string;
  aspect: "3/4" | "4/3" | "4/5" | "16/9";
}

interface Props {
  items: GalleryItem[];
  eyebrow?: string;
}

/**
 * Masonry gallery with varied aspect ratios, hover zoom + caption fade,
 * and staggered reveal animations on scroll.
 */
export default function GallerySection({ items, eyebrow = "Gallery" }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="gallery"
      className="w-full"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--ink)",
        padding: "var(--space-section) var(--gutter)",
      }}
    >
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
        <RevealSection>
          <p
            className="uppercase mb-8 md:mb-12"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--fs-eyebrow)",
              letterSpacing: "0.32em",
              color: "var(--accent)",
            }}
          >
            {eyebrow}
          </p>
        </RevealSection>

        {/* Masonry-style grid: 2 columns with varied heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-4 md:gap-6">
            {items.filter((_, i) => i % 2 === 0).map((item, i) => (
              <RevealSection key={`left-${i}`} delay={i * 0.12}>
                <GalleryCard item={item} />
              </RevealSection>
            ))}
          </div>
          {/* Right column - offset for masonry effect */}
          <div className="flex flex-col gap-4 md:gap-6 md:mt-16">
            {items.filter((_, i) => i % 2 === 1).map((item, i) => (
              <RevealSection key={`right-${i}`} delay={i * 0.12 + 0.06}>
                <GalleryCard item={item} />
              </RevealSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryCard({ item }: { item: GalleryItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-sm cursor-pointer group"
      style={{ aspectRatio: item.aspect }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={item.src}
        alt={item.caption || ""}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
        style={{
          transform: hovered ? "scale(1.06)" : "scale(1)",
        }}
        loading="lazy"
      />
      {/* Caption overlay on hover */}
      {item.caption && (
        <div
          className="absolute inset-0 flex items-end p-6 transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
          }}
        >
          <p
            className="text-white/90 text-sm tracking-wider uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {item.caption}
          </p>
        </div>
      )}
    </div>
  );
}
