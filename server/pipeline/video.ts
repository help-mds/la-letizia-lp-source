/**
 * Seedance 2.0 Fast (text-to-video) provider — Atlas Cloud.
 *
 * Faithfully translated from ZIP: lib/generators/video.ts
 *
 * Atlas Cloud body shape (per their docs):
 *   POST /api/v1/model/generateVideo
 *   { model, prompt, duration, resolution, ratio,
 *     generate_audio, watermark, seed? }
 *
 * Cost: $0.081/sec × duration_seconds (default 8s → $0.648) at 720p.
 */

const COST_PER_SECOND = 0.081;
const DEFAULT_DURATION = 8;
const DEFAULT_RATIO: SeedanceRatio = '16:9';
const DEFAULT_RESOLUTION: SeedanceResolution = '720p';
const POLL_INITIAL_DELAY_MS = 10_000;
const POLL_INTERVAL_MS = 5_000;
const POLL_TIMEOUT_MS = 5 * 60_000;

export type SeedanceRatio =
  | '16:9'
  | '9:16'
  | '4:3'
  | '3:4'
  | '1:1'
  | '21:9'
  | 'adaptive';

export type SeedanceResolution = '480p' | '720p' | '1080p';

export interface SeedanceSubmitInput {
  prompt: string;
  duration?: number;
  ratio?: SeedanceRatio;
  resolution?: SeedanceResolution;
  generateAudio?: boolean;
  watermark?: boolean;
  seed?: number;
  imageUrl?: string;
}

export interface VideoGenerationResult {
  videoUrl: string;
  taskId: string;
  cost_usd: number;
  duration_s: number;
  ratio: SeedanceRatio;
  resolution: SeedanceResolution;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateVideo(
  input: SeedanceSubmitInput,
): Promise<VideoGenerationResult> {
  const duration = input.duration ?? DEFAULT_DURATION;
  const ratio = input.ratio ?? DEFAULT_RATIO;
  const resolution = input.resolution ?? DEFAULT_RESOLUTION;
  const generateAudio = input.generateAudio ?? false;
  const watermark = input.watermark ?? false;

  const baseUrl = (process.env.SEEDANCE_API_BASE_URL ?? '').replace(/\/$/, '');
  const apiKey = process.env.SEEDANCE_API_KEY;
  if (!baseUrl) throw new Error('SEEDANCE_API_BASE_URL not set');
  if (!apiKey) throw new Error('SEEDANCE_API_KEY not set');

  const submitUrl = `${baseUrl}/api/v1/model/generateVideo`;
  const predictionUrl = (id: string) =>
    `${baseUrl}/api/v1/model/prediction/${encodeURIComponent(id)}`;
  const model =
    process.env.SEEDANCE_MODEL ??
    'bytedance/seedance-2.0-fast/text-to-video';

  // Submit
  const body: Record<string, unknown> = {
    model,
    prompt: input.prompt,
    duration,
    resolution,
    ratio,
    generate_audio: generateAudio,
    watermark,
  };
  if (typeof input.seed === 'number') body.seed = input.seed;

  const res = await fetch(submitUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`Atlas Cloud submit failed: ${res.status} ${raw}`);
  }

  const json = safeJson(raw) as
    | { data?: { id?: string }; id?: string; message?: string; code?: number };

  const taskId = json?.data?.id ?? json?.id;
  if (!taskId) {
    throw new Error(`Atlas Cloud submit returned no prediction id: ${raw}`);
  }

  // Poll
  await sleep(POLL_INITIAL_DELAY_MS);
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const pollRes = await fetch(predictionUrl(taskId), {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!pollRes.ok) {
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    type PredictionPayload = {
      status?: string;
      outputs?: unknown;
      error?: string | { message?: string };
    };
    const pollJson = (await pollRes.json()) as PredictionPayload & {
      data?: PredictionPayload;
    };

    const data: PredictionPayload = pollJson.data ?? pollJson;
    const status = (data.status ?? '').toLowerCase();

    if (status === 'completed' || status === 'succeeded') {
      const videoUrl = extractVideoUrl(data.outputs);
      if (!videoUrl) {
        throw new Error(`Atlas Cloud completed but no video URL in outputs: ${JSON.stringify(data.outputs)}`);
      }
      return {
        videoUrl,
        taskId,
        cost_usd: duration * COST_PER_SECOND,
        duration_s: duration,
        ratio,
        resolution,
      };
    }

    if (status === 'failed' || status === 'expired') {
      const errMsg = typeof data.error === 'string'
        ? data.error
        : data.error?.message ?? status;
      throw new Error(`Atlas Cloud task ${taskId} ${status}: ${errMsg}`);
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(`Atlas Cloud task ${taskId} timed out after ${POLL_TIMEOUT_MS}ms`);
}

function extractVideoUrl(outputs: unknown): string | undefined {
  if (!outputs) return undefined;
  if (typeof outputs === 'string') return outputs;
  if (Array.isArray(outputs)) {
    for (const item of outputs) {
      const u = extractVideoUrl(item);
      if (u) return u;
    }
    return undefined;
  }
  if (typeof outputs === 'object') {
    const o = outputs as Record<string, unknown>;
    for (const key of ['video_url', 'url', 'video', 'output']) {
      const v = o[key];
      if (typeof v === 'string') return v;
      if (v) {
        const u = extractVideoUrl(v);
        if (u) return u;
      }
    }
  }
  return undefined;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
