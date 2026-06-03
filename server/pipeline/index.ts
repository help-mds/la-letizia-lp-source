/**
 * Video generation pipeline orchestrator.
 *
 * Faithfully translated from ZIP: lib/generators/pipeline.ts
 *
 * Flow:
 * 1. Load lead from DB
 * 2. Build video prompt from ambiance + camera work
 * 3. Generate video via Atlas Cloud Seedance 2.0
 * 4. Extract frames via ffmpeg → WebP
 * 5. Upload frames to S3
 * 6. Update lead with frame URLs
 */

import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { leads } from '../../drizzle/schema';
import { generateVideo } from './video';
import { extractFramesAndUpload } from './frames';
import { buildCameraWork } from './prompts/cameraWork';
import { buildAmbiancePhrases, type AmbianceConfig } from './prompts/ambiance';

export async function runPipeline(leadId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // 1. Load lead
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!lead) throw new Error(`Lead ${leadId} not found`);

  // Update status
  await db.update(leads).set({ status: 'GENERATING_VIDEO' }).where(eq(leads.id, leadId));

  try {
    // 2. Build prompt
    const ambianceConfig: AmbianceConfig = {
      lighting: lead.ambianceLighting || 'cool_neutral',
      surfaces: lead.ambianceSurfaces || 'marble',
      colorPalette: lead.ambianceColorPalette || 'cool_neutral',
      mood: lead.ambianceMood || 'refined',
      timeOfDay: lead.ambianceTimeOfDay || 'midday',
    };

    const ambiancePhrases = buildAmbiancePhrases(ambianceConfig);
    const cameraWork = buildCameraWork({
      businessType: lead.businessType,
      businessSubtype: lead.businessSubtype || undefined,
      ambiancePhrases,
    });

    const prompt = `${cameraWork} ${ambiancePhrases} Interior of a modern cafe space. Photorealistic, cinematic quality, 24fps film look.`;

    // 3. Generate video
    const videoResult = await generateVideo({
      prompt,
      duration: 8,
      ratio: '16:9',
      resolution: '720p',
      generateAudio: false,
      watermark: false,
      seed: 12345,
    });

    // Update lead with video info
    await db.update(leads).set({
      status: 'EXTRACTING_FRAMES',
      videoUrl: videoResult.videoUrl,
      videoTaskId: videoResult.taskId,
      videoCostUsd: String(videoResult.cost_usd),
    }).where(eq(leads.id, leadId));

    // 4. Extract frames and upload
    const framesResult = await extractFramesAndUpload({
      videoSource: videoResult.videoUrl,
      slug: lead.slug,
      fps: 30,
      width: 1280,
      height: 720,
      pathSuffix: 'landscape',
    });

    // 5. Update lead with frame URLs
    await db.update(leads).set({
      status: 'READY',
      frameCountLandscape: framesResult.frameCount,
      frameUrlsLandscape: framesResult.frameUrls,
    }).where(eq(leads.id, leadId));

  } catch (err) {
    console.error(`[pipeline] lead=${leadId} failed:`, err);
    await db.update(leads).set({ status: 'PIPELINE_FAILED' }).where(eq(leads.id, leadId));
    throw err;
  }
}
