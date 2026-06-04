import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

interface SceneNavigationProps {
  scenes: Array<{ id: string; label: string; dotLabel: string }>;
  currentIndex: number;
  onNavigate: (index: number) => void;
  onReserve: () => void;
}

/**
 * SceneNavigation: Tabs (top), arrows (right), persistent CTA.
 * Dots removed per design feedback — arrows only for scene navigation.
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

      {/* Arrow navigation (larger, no dots) */}
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
