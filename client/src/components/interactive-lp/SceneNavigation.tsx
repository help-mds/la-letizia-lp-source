import { useState, useCallback } from 'react';
import { IconChevronUp, IconChevronDown, IconShare } from '@tabler/icons-react';

interface SceneNavigationProps {
  scenes: Array<{ id: string; label: string; dotLabel: string }>;
  currentIndex: number;
  onNavigate: (index: number) => void;
  onReserve: () => void;
  storeName?: string;
  /** When true, uses light glass style (for white loading background) */
  isLoading?: boolean;
}

/**
 * SceneNavigation: Top header bar (store name + Created by MDS),
 * Glassmorphism pill dot-nav (top center with circle dots),
 * glass arrows (right-bottom on mobile), share button (left-bottom),
 * beige/gold RESERVE CTA.
 *
 * Supports two visual modes:
 * - isLoading=true: light glass (for white background loading screen)
 * - isLoading=false: dark glass (for dark hero/scene backgrounds)
 */
export default function SceneNavigation({
  scenes,
  currentIndex,
  onNavigate,
  onReserve,
  storeName = '',
  isLoading = false,
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

  // CSS class modifier for light/dark glass mode
  const modeClass = isLoading ? 'light-glass' : '';

  return (
    <>
      {/* Top header bar — store name left, Created by MDS right */}
      <div className={`scene-top-header ${modeClass}`}>
        <span className="scene-top-header-name">{storeName}</span>
        <a
          href="https://mds-fund.com"
          target="_blank"
          rel="noopener noreferrer"
          className="scene-top-header-credit"
        >
          Created by MDS
        </a>
      </div>

      {/* Glassmorphism pill dot nav — below header */}
      <div className={`scene-pill-nav ${modeClass}`}>
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
      <div className={`scene-arrows ${modeClass}`}>
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
        className={`scene-persistent-cta ${modeClass}`}
        onClick={onReserve}
        aria-label="Reserve a table"
      >
        RESERVE
      </button>

      {/* Share button — left bottom, glass style */}
      <button
        className={`scene-share-btn ${modeClass}`}
        onClick={handleShare}
        aria-label="Share this page"
        title={copied ? 'Copied!' : 'Share'}
      >
        <IconShare size={20} />
        {copied && <span className="scene-share-copied">{copied ? 'Copied!' : ''}</span>}
      </button>
    </>
  );
}
