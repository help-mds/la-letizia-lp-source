/**
 * Video generation pipeline orchestrator.
 *
 * Faithfully translated from ZIP: lib/generators/pipeline.ts
 * Updated to use ambianceFor() resolver (Method A + B inference).
 *
 * Flow:
 * 1. Load lead from DB
 * 2. Resolve ambiance (explicit → inferred → template default)
 * 3. Build video prompt from ambiance + camera work
 * 4. Generate video via Atlas Cloud Seedance 2.0
 * 5. Extract frames via ffmpeg → WebP
 * 6. Upload frames to S3
 * 7. Update lead with frame URLs
 */

import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { leads } from '../../drizzle/schema';
import { generateVideo } from './video';
import { extractFramesAndUpload } from './frames';
import { buildCameraWork } from './prompts/cameraWork';
import { ambiancePhrases } from './prompts/ambiance';
import { ambianceFor } from './prompts/defaultAmbiance';

export async function runPipeline(leadId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // 1. Load lead
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!lead) throw new Error(`Lead ${leadId} not found`);

  // Update status
  await db.update(leads).set({ status: 'GENERATING_VIDEO' }).where(eq(leads.id, leadId));

  try {
    // 2. Resolve ambiance (explicit → inferred → template default)
    const resolvedAmbiance = await ambianceFor({
      ambiance_lighting: lead.ambianceLighting,
      ambiance_surfaces: lead.ambianceSurfaces,
      ambiance_colorPalette: lead.ambianceColorPalette,
      ambiance_mood: lead.ambianceMood,
      ambiance_timeOfDay: lead.ambianceTimeOfDay,
      palette_accent: lead.paletteAccent,
      template: lead.template,
      business_subtype: lead.businessSubtype,
      business_type: lead.businessType,
      source_photos: lead.sourcePhotos,
      photo_urls: lead.photoUrls,
      notes: lead.notes,
      area: lead.area,
    });

    console.log(`[pipeline] lead=${leadId} resolved ambiance:`, resolvedAmbiance);

    // 3. Build prompt
    const phrases = ambiancePhrases(resolvedAmbiance);
    const cameraWork = buildCameraWork({
      businessType: lead.businessType,
      businessSubtype: lead.businessSubtype || undefined,
      ambiancePhrases: phrases.combined,
    });

    const prompt = `${cameraWork} ${phrases.combined} Interior of a modern ${lead.businessSubtype || lead.businessType} space. Photorealistic, cinematic quality, 24fps film look.`;

    console.log(`[pipeline] lead=${leadId} prompt: ${prompt.slice(0, 200)}...`);

    // 4. Generate video
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

    // 5. Extract frames and upload
    const framesResult = await extractFramesAndUpload({
      videoSource: videoResult.videoUrl,
      slug: lead.slug,
      fps: 30,
      width: 1280,
      height: 720,
      pathSuffix: 'landscape',
    });

    // 6. Update lead with frame URLs
    await db.update(leads).set({
      status: 'READY',
      frameCountLandscape: framesResult.frameCount,
      frameUrlsLandscape: framesResult.frameUrls,
    }).where(eq(leads.id, leadId));

    console.log(`[pipeline] lead=${leadId} complete: ${framesResult.frameCount} frames`);

  } catch (err) {
    console.error(`[pipeline] lead=${leadId} failed:`, err);
    await db.update(leads).set({ status: 'PIPELINE_FAILED' }).where(eq(leads.id, leadId));
    throw err;
  }
}
