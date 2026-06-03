import { useEffect, useRef } from "react";

interface AtmosphereSectionProps {
  imageUrl: string;
  caption: string;
}

/**
 * Full-bleed immersive image section with Ken Burns slow zoom
 * and parallax scrolling. Transitions from the dark scrub world
 * into the white content sections below.
 */
export default function AtmosphereSection({ imageUrl, caption }: AtmosphereSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        // progress: 0 when section enters viewport, 1 when it leaves
        const progress = Math.max(0, Math.min(1, 1 - (rect.bottom / (vh + rect.height))));
        // Ken Burns: scale from 1.0 to 1.12
        const scale = 1 + progress * 0.12;
        // Parallax: slight upward shift
        const translateY = progress * -30;
        img.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: "70vh" }}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{ transform: "scale(1)", transition: "transform 0.1s linear" }}
      />
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-[var(--gutter)] pb-12">
        <p
          className="font-serif text-white/90 text-lg md:text-xl tracking-wide max-w-[600px]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {caption}
        </p>
      </div>
    </section>
  );
}
