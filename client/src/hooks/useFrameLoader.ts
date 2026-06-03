import { useEffect, useRef, useState } from 'react';

export interface FrameLoaderOptions {
  /**
   * Either:
   * - A URL prefix ending with `/` (e.g. https://…/frames/slug/landscape/)
   *   in which case frames are fetched as {prefix}{0001}.webp, {prefix}{0002}.webp, etc.
   * - OR an array of full URLs for each frame (when storagePut adds hash suffixes).
   */
  basePath?: string;
  frameUrls?: string[];
  /** Total number of frames available (used with basePath mode). */
  frameCount: number;
  /**
   * Load every Nth frame. Desktop = 1 (all frames), mobile = 2 (half).
   */
  stride?: number;
}

export interface FrameLoader {
  progress: number;
  ready: boolean;
  getFrameAt: (progress: number) => HTMLImageElement | null;
}

/**
 * Preloads a sequence of WebP frames and exposes a getter
 * that maps scroll progress (0–1) to the nearest loaded frame.
 *
 * Supports two modes:
 * 1. basePath + frameCount: constructs URLs as {basePath}{NNNN}.webp
 * 2. frameUrls: uses exact URLs from the array
 */
export function useFrameLoader({
  basePath,
  frameUrls,
  frameCount,
  stride = 1,
}: FrameLoaderOptions): FrameLoader {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);

  const totalFrames = frameUrls ? frameUrls.length : frameCount;

  useEffect(() => {
    if (totalFrames <= 0) return;
    if (!basePath && (!frameUrls || frameUrls.length === 0)) return;

    // Normalize trailing slash for basePath mode
    const base = basePath ? (basePath.endsWith('/') ? basePath : `${basePath}/`) : '';

    const totalToLoad = Math.ceil(totalFrames / stride);
    let loaded = 0;
    const frames: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null);
    framesRef.current = frames;

    const onComplete = () => {
      loaded++;
      setProgress(loaded / totalToLoad);
      if (loaded >= totalToLoad) {
        setReady(true);
      }
    };

    for (let i = 0; i < totalFrames; i += stride) {
      const img = new Image();
      if (frameUrls) {
        img.src = frameUrls[i];
      } else {
        const fileName = `${String(i + 1).padStart(4, '0')}.webp`;
        img.src = `${base}${fileName}`;
      }
      img.onload = () => {
        frames[i] = img;
        onComplete();
      };
      img.onerror = () => {
        frames[i] = null;
        onComplete();
      };
    }

    return () => {
      // Cleanup: detach all handlers
      for (let i = 0; i < totalFrames; i += stride) {
        const img = frames[i];
        if (img) {
          img.onload = null;
          img.onerror = null;
          img.src = ''; // Cancel pending loads
        }
      }
    };
  }, [basePath, frameUrls, totalFrames, stride]);

  const getFrameAt = (p: number): HTMLImageElement | null => {
    const frames = framesRef.current;
    if (!frames.length) return null;

    const idx = Math.round(p * (frames.length - 1));
    if (frames[idx]) return frames[idx];

    // Search outward for nearest loaded frame
    for (let offset = 1; offset < frames.length; offset++) {
      if (idx + offset < frames.length && frames[idx + offset]) {
        return frames[idx + offset];
      }
      if (idx - offset >= 0 && frames[idx - offset]) {
        return frames[idx - offset];
      }
    }
    return null;
  };

  return { progress, ready, getFrameAt };
}
