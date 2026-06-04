import { useState, useCallback } from 'react';
import { IconChevronUp, IconChevronDown, IconShare } from '@tabler/icons-react';

interface SceneNavigationProps {
  scenes: Array<{ id: string; label: string; dotLabel: string }>;
  currentIndex: number;
  onNavigate: (index: number) => void;
  onReserve: () => void;
}

/**
 * SceneNavigation: Glassmorphism pill dot-nav (top center with circle dots),
 * glass arrows (right-bottom on mobile), share button (left-bottom),
 * beige/gold RESERVE CTA, and MDS badge (bottom-left).
 */
export default function SceneNavigation({
  scenes,
  currentIndex,
  onNavigate,
  onReserve,
}: SceneNavigationProps) {
  const [copied, setCopied] = useState(false);

  // Filter out the Reserve/cta scene from the dot nav
  const navScenes = scenes.filter((s) => s.id !== 'cta');

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = window.location.href;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <>
      {/* Glassmorphism pill dot nav — top center with circle dots */}
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
              <span className="scene-pill-dot-circle" />
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

      {/* Persistent Reserve CTA — beige/gold glass */}
      <button
        className="scene-persistent-cta"
        onClick={onReserve}
        aria-label="Reserve a table"
      >
        RESERVE
      </button>

      {/* Share button — left bottom, glass style */}
      <button
        className="scene-share-btn"
        onClick={handleShare}
        aria-label="Share this page"
        title={copied ? 'Copied!' : 'Share'}
      >
        <IconShare size={20} />
        {copied && <span className="scene-share-copied">Copied!</span>}
      </button>

      {/* MDS Badge - bottom left (below share button) */}
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
