import { useEffect, useState } from 'react';

interface SceneTransitionProps {
  isTransitioning: boolean;
  eyebrow: string;
  title: string;
}

/**
 * SceneTransition: Cinematic curtain + chapter title card.
 * 
 * Sequence (1.6s total):
 * 1. Current scene zooms in slightly (handled by parent via CSS class)
 * 2. Black curtain fades in (0.4s)
 * 3. Chapter title appears (0.5s hold)
 * 4. Curtain fades out + new scene zooms out from 1.08 to 1.0
 */
export default function SceneTransition({
  isTransitioning,
  eyebrow,
  title,
}: SceneTransitionProps) {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      // Show title card after curtain is fully opaque
      const timer = setTimeout(() => setShowTitle(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowTitle(false);
    }
  }, [isTransitioning]);

  return (
    <>
      {/* Black curtain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: '#000',
          opacity: isTransitioning ? 1 : 0,
          transition: 'opacity 0.45s ease',
          zIndex: 50,
        }}
      />

      {/* Chapter title card */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          zIndex: 51,
          opacity: showTitle ? 1 : 0,
          transform: showTitle ? 'scale(1)' : 'scale(0.92)',
          transition: 'opacity 0.4s ease, transform 0.8s ease',
        }}
      >
        <div className="text-center">
          <div
            style={{
              fontSize: '9px',
              letterSpacing: '0.5em',
              opacity: 0.5,
              marginBottom: '12px',
              color: 'white',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Garamond", Georgia, serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 400,
              lineHeight: 1.0,
              color: 'white',
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: '50px',
              height: '0.5px',
              background: 'rgba(255,255,255,0.4)',
              margin: '16px auto 0',
            }}
          />
        </div>
      </div>
    </>
  );
}
