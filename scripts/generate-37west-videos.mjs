/**
 * Generate Hero (forward dolly) and Story (horizontal pan) videos for 37 West
 * using Seedance 2.0 image-to-video API.
 */

const SEEDANCE_API_BASE_URL = process.env.SEEDANCE_API_BASE_URL?.replace(/\/$/, '');
const SEEDANCE_API_KEY = process.env.SEEDANCE_API_KEY;

if (!SEEDANCE_API_BASE_URL || !SEEDANCE_API_KEY) {
  console.error('Missing SEEDANCE_API_BASE_URL or SEEDANCE_API_KEY');
  process.exit(1);
}

const IMAGE_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663064885811/acJPaqMSIbRwsQkc.webp';

const HERO_PROMPT = `A continuous 8-second cinematic shot starting from the exact frame provided. The camera slowly dollies forward at eye level, moving between the leather booth seats toward the back of this upscale steakhouse restaurant. Warm golden lighting from overhead cage-style chandeliers casts amber glow on polished wood tables and leather upholstery. Subtle parallax on foreground booth edges. The movement is unhurried and continuous — no cuts, no pans, no tilts. Photorealistic, cinematic quality, 24fps film look. Dim moody atmosphere, evening ambiance.`;

const STORY_PROMPT = `A continuous 10-second cinematic shot starting from the exact frame provided. The camera pans horizontally left-to-right at eye level, following along the leather booths and tables of this upscale steakhouse. Warm golden lighting from cage-style chandeliers reveals wine glasses, place settings, and the buffalo mural on the wall as the camera glides past. The movement is smooth and continuous — purely horizontal pan, no vertical movement, no cuts. Photorealistic, cinematic quality, 24fps film look. Dim moody atmosphere, evening ambiance.`;

const MODEL_TEXT_TO_VIDEO = 'bytedance/seedance-2.0-fast/text-to-video';
const MODEL_IMAGE_TO_VIDEO = 'bytedance/seedance-2.0-fast/image-to-video';

async function submitVideo(prompt, duration, model, imageUrl) {
  const submitUrl = `${SEEDANCE_API_BASE_URL}/api/v1/model/generateVideo`;
  
  const body = {
    model,
    prompt,
    duration,
    resolution: '720p',
    ratio: '16:9',
    generate_audio: false,
    watermark: false,
    seed: 12345,
  };
  
  if (imageUrl) {
    body.image_url = imageUrl;
  }

  console.log(`[submit] model=${model}, duration=${duration}s, prompt=${prompt.slice(0, 80)}...`);
  
  const res = await fetch(submitUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SEEDANCE_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`Submit failed: ${res.status} ${raw}`);
  }

  const json = JSON.parse(raw);
  const taskId = json?.data?.id ?? json?.id;
  if (!taskId) {
    throw new Error(`No task ID in response: ${raw}`);
  }
  
  console.log(`[submit] taskId=${taskId}`);
  return taskId;
}

async function pollVideo(taskId) {
  const predictionUrl = `${SEEDANCE_API_BASE_URL}/api/v1/model/prediction/${encodeURIComponent(taskId)}`;
  const deadline = Date.now() + 10 * 60_000; // 10 min timeout
  
  await new Promise(r => setTimeout(r, 15_000)); // initial wait
  
  while (Date.now() < deadline) {
    const res = await fetch(predictionUrl, {
      headers: { 'Authorization': `Bearer ${SEEDANCE_API_KEY}` },
    });
    
    if (!res.ok) {
      console.log(`[poll] ${taskId}: HTTP ${res.status}, retrying...`);
      await new Promise(r => setTimeout(r, 5_000));
      continue;
    }
    
    const json = await res.json();
    const data = json.data ?? json;
    const status = (data.status ?? '').toLowerCase();
    
    if (status === 'completed' || status === 'succeeded') {
      const videoUrl = extractVideoUrl(data.outputs);
      if (!videoUrl) {
        throw new Error(`Completed but no video URL: ${JSON.stringify(data.outputs)}`);
      }
      console.log(`[poll] ${taskId}: COMPLETED → ${videoUrl}`);
      return videoUrl;
    }
    
    if (status === 'failed' || status === 'expired') {
      throw new Error(`Task ${taskId} ${status}: ${JSON.stringify(data.error)}`);
    }
    
    console.log(`[poll] ${taskId}: status=${status || 'processing'}...`);
    await new Promise(r => setTimeout(r, 5_000));
  }
  
  throw new Error(`Task ${taskId} timed out`);
}

function extractVideoUrl(outputs) {
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
    for (const key of ['video_url', 'url', 'video', 'output']) {
      const v = outputs[key];
      if (typeof v === 'string') return v;
      if (v) {
        const u = extractVideoUrl(v);
        if (u) return u;
      }
    }
  }
  return undefined;
}

async function main() {
  console.log('=== 37 West Video Generation ===');
  console.log(`Image URL: ${IMAGE_URL}`);
  console.log('');
  
  // Submit both videos in parallel
  console.log('--- Submitting Hero (forward dolly, 8s) ---');
  const heroTaskId = await submitVideo(HERO_PROMPT, 8, MODEL_IMAGE_TO_VIDEO, IMAGE_URL);
  
  console.log('');
  console.log('--- Submitting Story (horizontal pan, 10s) ---');
  const storyTaskId = await submitVideo(STORY_PROMPT, 10, MODEL_IMAGE_TO_VIDEO, IMAGE_URL);
  
  console.log('');
  console.log('--- Polling both tasks ---');
  
  // Poll in parallel
  const [heroUrl, storyUrl] = await Promise.all([
    pollVideo(heroTaskId),
    pollVideo(storyTaskId),
  ]);
  
  console.log('');
  console.log('=== RESULTS ===');
  console.log(`Hero video URL: ${heroUrl}`);
  console.log(`Story video URL: ${storyUrl}`);
  console.log(`Hero task ID: ${heroTaskId}`);
  console.log(`Story task ID: ${storyTaskId}`);
  console.log(`Estimated cost: $${(8 * 0.081 + 10 * 0.081).toFixed(3)}`);
  
  // Save results to a JSON file
  const results = {
    hero: { taskId: heroTaskId, videoUrl: heroUrl, duration: 8 },
    story: { taskId: storyTaskId, videoUrl: storyUrl, duration: 10 },
    imageUrl: IMAGE_URL,
    totalCost: (8 * 0.081 + 10 * 0.081),
  };
  
  const fs = await import('fs');
  fs.writeFileSync('/home/ubuntu/la-letizia-lp/scripts/37west-video-results.json', JSON.stringify(results, null, 2));
  console.log('Results saved to scripts/37west-video-results.json');
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
