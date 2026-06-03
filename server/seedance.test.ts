import { describe, expect, it } from 'vitest';

/**
 * Validates that the SEEDANCE_API_BASE_URL and SEEDANCE_API_KEY
 * environment variables are set and can reach the Atlas Cloud API.
 */
describe('Seedance API credentials', () => {
  it('should have SEEDANCE_API_BASE_URL set', () => {
    const url = process.env.SEEDANCE_API_BASE_URL;
    expect(url).toBeTruthy();
    expect(url).toMatch(/^https?:\/\//);
  });

  it('should have SEEDANCE_API_KEY set', () => {
    const key = process.env.SEEDANCE_API_KEY;
    expect(key).toBeTruthy();
    expect(key!.length).toBeGreaterThan(5);
  });

  it('should be able to reach the Atlas Cloud API', async () => {
    const baseUrl = (process.env.SEEDANCE_API_BASE_URL ?? '').replace(/\/$/, '');
    const apiKey = process.env.SEEDANCE_API_KEY;

    // Try to hit the models endpoint or a lightweight endpoint
    // If that doesn't exist, just verify the base URL is reachable
    const res = await fetch(`${baseUrl}/api/v1/model/generateVideo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'bytedance/seedance-2.0-fast/text-to-video',
        prompt: 'test',
        duration: 5,
        resolution: '480p',
        ratio: '16:9',
        generate_audio: false,
        watermark: false,
      }),
    });

    // We expect either success (200/201/202) or a known error (400/422 for bad params)
    // but NOT 401/403 which would indicate bad credentials
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  }, 30000);
});
