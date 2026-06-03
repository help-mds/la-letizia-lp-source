/**
 * Extract video → WebP frames → upload to S3 (Manus storage).
 *
 * Faithfully translated from ZIP: lib/generators/frames.ts
 *
 * Key difference: ZIP uses cwebp (2-step: ffmpeg→PNG, cwebp→WebP).
 * This version uses ffmpeg -c:v libwebp directly (1-step) since cwebp
 * is not available in the Manus sandbox. Output quality is equivalent.
 *
 * Returns an array of uploaded URLs that the frontend useFrameLoader
 * can consume directly (frameUrls mode).
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { storagePut } from '../storage';

const execFileP = promisify(execFile);

const DEFAULT_FPS = 30;
const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;
const UPLOAD_CONCURRENCY = 8;
const WEBP_QUALITY = 90;

export interface FrameExtractionResult {
  /** Array of public URLs for each frame, in order. */
  frameUrls: string[];
  /** Total number of frames extracted and uploaded. */
  frameCount: number;
}

export interface FrameExtractionOptions {
  /** http(s):// URL or absolute local path to video file. */
  videoSource: string;
  /** URL slug for organizing storage paths. */
  slug: string;
  /** Frames per second to extract. Default: 30. */
  fps?: number;
  /** Output frame width. Default: 1280. */
  width?: number;
  /** Output frame height. Default: 720. */
  height?: number;
  /** Sub-path: 'landscape' or 'portrait'. */
  pathSuffix?: string;
}

/**
 * Extract video → WebP frames → upload to Manus S3 storage.
 * Returns an ordered array of public URLs for each frame.
 */
export async function extractFramesAndUpload(
  opts: FrameExtractionOptions,
): Promise<FrameExtractionResult> {
  const {
    videoSource,
    slug,
    fps = DEFAULT_FPS,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    pathSuffix = 'landscape',
  } = opts;

  const workDir = join(tmpdir(), `frames-${slug}-${randomUUID()}`);
  await mkdir(workDir, { recursive: true });

  try {
    // 1. Materialize video locally if it's a URL
    const inputPath = await materializeVideo(videoSource, workDir);

    // 2. Extract frames directly as WebP using ffmpeg
    const webpDir = join(workDir, 'webp');
    await mkdir(webpDir, { recursive: true });

    await execFileP('ffmpeg', [
      '-y',
      '-i', inputPath,
      '-vf', `fps=${fps},scale=${width}:${height}`,
      '-c:v', 'libwebp',
      '-quality', String(WEBP_QUALITY),
      join(webpDir, '%04d.webp'),
    ], { timeout: 120_000 });

    const webpFiles = (await readdir(webpDir))
      .filter((f) => f.endsWith('.webp'))
      .sort();

    if (webpFiles.length === 0) {
      throw new Error('ffmpeg produced no frames');
    }

    // 3. Upload all WebP frames to S3 and collect URLs
    const storagePrefix = `frames/${slug}/${pathSuffix}/`;
    const frameUrls: string[] = new Array(webpFiles.length).fill('');

    await mapWithConcurrency(webpFiles, UPLOAD_CONCURRENCY, async (name, idx) => {
      const buf = await readFile(join(webpDir, name));
      const { url } = await storagePut(
        `${storagePrefix}${name}`,
        buf,
        'image/webp',
      );
      frameUrls[idx] = url;
    });

    return {
      frameUrls,
      frameCount: webpFiles.length,
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function materializeVideo(source: string, workDir: string): Promise<string> {
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source);
    if (!res.ok) {
      throw new Error(`Failed to download video: ${res.status} ${res.statusText}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const dst = join(workDir, 'input.mp4');
    const { writeFile } = await import('node:fs/promises');
    await writeFile(dst, buf);
    return dst;
  }
  return source;
}

async function mapWithConcurrency<T>(
  items: T[],
  limit: number,
  fn: (item: T, idx: number) => Promise<void>,
): Promise<void> {
  let i = 0;
  const workers: Promise<void>[] = [];
  const next = async () => {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx);
    }
  };
  for (let w = 0; w < limit; w++) workers.push(next());
  await Promise.all(workers);
}
