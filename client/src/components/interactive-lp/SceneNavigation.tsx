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
  /** URL for the "自社用に修正する" CTA button */
  customizeUrl?: string;
}

/**
 * SceneNavigation: Top header bar (store name + CREATED BY MDS prominent),
 * Neomorphic glass pill dot-nav with outer container,
 * Neomorphic glass arrows with outer container (vertical pill),
 * Share button with outer container,
 * RESERVE CTA with glass styling.
 */
export default function SceneNavigation({
  scenes,
  currentIndex,
  onNavigate,
  onReserve,
  storeName = '',
  isLoading = false,
  customizeUrl,
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

  const modeClass = isLoading ? 'light-glass' : '';

  return (
    <>
      {/* Top header bar — store name left, CREATED BY MDS right (prominent) */}
      <div className={`scene-top-header ${modeClass}`}>
        <span className="scene-top-header-name">{storeName}</span>
        <a
          href="https://mds-fund.com"
          target="_blank"
          rel="noopener noreferrer"
          className="scene-top-header-credit"
        >
          CREATED BY MDS
        </a>
      </div>

      {/* Neomorphic glass pill dot nav — outer container + inner dot buttons */}
      <div className={`scene-pill-nav-container ${modeClass}`}>
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
      </div>

      {/* Neomorphic glass arrow container — outer pill + inner buttons */}
      <div className={`scene-arrows-container ${modeClass}`}>
        <button
          className="scene-arrow-btn"
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label="前のセクション"
        >
          <IconChevronUp size={26} strokeWidth={2.5} />
        </button>
        <button
          className="scene-arrow-btn"
          onClick={() => onNavigate(currentIndex + 1)}
          disabled={currentIndex === scenes.length - 1}
          aria-label="次のセクション"
        >
          <IconChevronDown size={26} strokeWidth={2.5} />
        </button>
      </div>

      {/* Persistent Reserve CTA with outer enclosure */}
      <div className={`scene-reserve-container ${modeClass}`}>
        <button
          className={`scene-persistent-cta ${modeClass}`}
          onClick={onReserve}
          aria-label="予約する"
        >
          RESERVE
        </button>
      </div>

      {/* Share button with outer glass container */}
      <div className={`scene-share-container ${modeClass}`}>
        <button
          className="scene-share-btn"
          onClick={handleShare}
          aria-label="共有する"
          title={copied ? 'コピーしました' : '共有'}
        >
          <IconShare size={20} strokeWidth={2.5} />
        </button>
        {copied && <span className="scene-share-copied">コピーしました</span>}
      </div>

      {/* "自社用に修正する" CTA — fixed bottom-right */}
      {customizeUrl && (
        <a
          href={customizeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`scene-customize-container ${modeClass}`}
        >
          <span className="scene-customize-btn">自社用に修正する</span>
        </a>
      )}
    </>
  );
}
