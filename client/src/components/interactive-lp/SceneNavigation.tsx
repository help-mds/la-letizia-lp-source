import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

interface SceneNavigationProps {
  scenes: Array<{ id: string; label: string; dotLabel: string }>;
  currentIndex: number;
  onNavigate: (index: number) => void;
  onReserve: () => void;
}

/**
 * SceneNavigation: Glassmorphism pill dot-nav (top center), glass arrows (right-bottom on mobile),
 * beige/gold RESERVE CTA, and MDS badge.
 * Inspired by Marina Bay Sands interactive experience.
 */
export default function SceneNavigation({
  scenes,
  currentIndex,
  onNavigate,
  onReserve,
}: SceneNavigationProps) {
  // Filter out the Reserve/cta scene from the dot nav (it has its own CTA button)
  const navScenes = scenes.filter((s) => s.id !== 'cta');

  return (
    <>
      {/* Glassmorphism pill dot nav — top center with labels */}
      <div className="scene-pill-nav">
        {navScenes.map((scene) => {
          const realIndex = scenes.findIndex((s) => s.id === scene.id);
          return (
            <button
              key={scene.id}
              className={`scene-pill-dot ${realIndex === currentIndex ? 'active' : ''}`}
              onClick={() => onNavigate(realIndex)}
              aria-label={scene.label}
              title={scene.label}
            >
              {scene.dotLabel}
            </button>
          );
        })}
      </div>

      {/* Glass arrow navigation (right side desktop, right-bottom mobile) */}
      <div className="scene-arrows">
        <button
          className="scene-arrow-btn"
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label="Previous scene"
        >
          <IconChevronUp size={26} />
        </button>
        <button
          className="scene-arrow-btn"
          onClick={() => onNavigate(currentIndex + 1)}
          disabled={currentIndex === scenes.length - 1}
          aria-label="Next scene"
        >
          <IconChevronDown size={26} />
        </button>
      </div>

      {/* Persistent Reserve CTA — beige/gold */}
      <button
        className="scene-persistent-cta"
        onClick={onReserve}
        aria-label="Reserve a table"
      >
        RESERVE
      </button>

      {/* MDS Badge - top left */}
      <a
        href="https://mds-fund.com"
        target="_blank"
        rel="noopener noreferrer"
        className="scene-mds-badge"
      >
        DESIGNED BY MDS
      </a>
    </>
  );
}
