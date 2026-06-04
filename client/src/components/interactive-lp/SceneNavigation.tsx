import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

interface SceneNavigationProps {
  scenes: Array<{ id: string; label: string; dotLabel: string }>;
  currentIndex: number;
  onNavigate: (index: number) => void;
  onReserve: () => void;
}

/**
 * SceneNavigation: Compact pill dot-nav (top center), arrows (right), MDS badge.
 * Reserve tab removed from header — only the persistent CTA remains.
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
      {/* Compact pill dot nav — top center */}
      <div className="scene-pill-nav">
        {navScenes.map((scene, i) => {
          // Find the real index in the full scenes array
          const realIndex = scenes.findIndex((s) => s.id === scene.id);
          return (
            <button
              key={scene.id}
              className={`scene-pill-dot ${realIndex === currentIndex ? 'active' : ''}`}
              onClick={() => onNavigate(realIndex)}
              aria-label={scene.label}
              title={scene.label}
            />
          );
        })}
      </div>

      {/* Arrow navigation (right side) */}
      <div className="scene-arrows">
        <button
          className="scene-arrow-btn"
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label="Previous scene"
        >
          <IconChevronUp size={22} />
        </button>
        <button
          className="scene-arrow-btn"
          onClick={() => onNavigate(currentIndex + 1)}
          disabled={currentIndex === scenes.length - 1}
          aria-label="Next scene"
        >
          <IconChevronDown size={22} />
        </button>
      </div>

      {/* Persistent Reserve CTA — top right */}
      <button
        className="scene-persistent-cta"
        onClick={onReserve}
        aria-label="Reserve a table"
      >
        RESERVE
      </button>

      {/* MDS Badge - bottom left */}
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
