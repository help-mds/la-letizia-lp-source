import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

interface SceneNavigationProps {
  scenes: Array<{ id: string; label: string; dotLabel: string }>;
  currentIndex: number;
  onNavigate: (index: number) => void;
  onReserve: () => void;
}

/**
 * SceneNavigation: Tabs (top), dots (right), arrows (right-bottom), persistent CTA.
 * Matches the prototype's navigation exactly.
 */
export default function SceneNavigation({
  scenes,
  currentIndex,
  onNavigate,
  onReserve,
}: SceneNavigationProps) {
  return (
    <>
      {/* Top tab bar */}
      <div className="scene-tabs">
        {scenes.map((scene, i) => (
          <button
            key={scene.id}
            className={`scene-tab ${i === currentIndex ? 'active' : ''}`}
            onClick={() => onNavigate(i)}
            aria-label={scene.label}
          >
            {scene.label}
          </button>
        ))}
      </div>

      {/* Right dot navigation */}
      <div className="scene-dots">
        {scenes.map((scene, i) => (
          <button
            key={scene.id}
            className={`scene-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => onNavigate(i)}
            aria-label={`Go to ${scene.label}`}
          >
            {scene.dotLabel}
          </button>
        ))}
      </div>

      {/* Arrow navigation */}
      <div className="scene-arrows">
        <button
          className="scene-arrow-btn"
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label="Previous scene"
        >
          <IconChevronUp size={18} />
        </button>
        <button
          className="scene-arrow-btn"
          onClick={() => onNavigate(currentIndex + 1)}
          disabled={currentIndex === scenes.length - 1}
          aria-label="Next scene"
        >
          <IconChevronDown size={18} />
        </button>
      </div>

      {/* Persistent Reserve CTA */}
      <button
        className="scene-persistent-cta"
        onClick={onReserve}
        aria-label="Reserve a table"
      >
        Reserve
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
