import { describe, expect, it } from 'vitest';
import { inferAmbianceFromStoreData } from './pipeline/prompts/inferAmbiance';
import { ambianceFor } from './pipeline/prompts/defaultAmbiance';

describe('inferAmbianceFromStoreData — Method A (keyword matching)', () => {
  it('infers cool_neutral + marble for La Letizia notes', async () => {
    const result = await inferAmbianceFromStoreData({
      store_photos: null,
      notes: 'Modern minimal cafe along Dubai Marina. Marble counters, slow coffee, daytime culture. Refined but accessible. Day-focused, no nightlife angle.',
      area: 'Dubai Marina',
      business_subtype: 'cafe',
    });

    expect(result).not.toBeNull();
    expect(result!.lighting).toBe('cool_neutral');
    expect(result!.surfaces).toBe('marble');
    expect(result!.mood).toBe('refined_minimal');
  });

  it('infers dim_moody + wood for a Japanese izakaya', async () => {
    const result = await inferAmbianceFromStoreData({
      store_photos: null,
      notes: 'Intimate evening-only izakaya. Dark wooden interior, warm dim lighting, hushed atmosphere. Speakeasy-style entrance.',
      area: 'DIFC',
      business_subtype: 'japanese',
    });

    expect(result).not.toBeNull();
    // 'dim' + 'hushed' + 'speakeasy' match dim_moody; but 'warm' + 'intimate' also match warm_tungsten
    // The key point: it should NOT be cool_neutral or bright_airy
    expect(['dim_moody', 'warm_tungsten']).toContain(result!.lighting);
    expect(result!.surfaces).toBe('wood');
  });

  it('infers earthy_terracotta + plaster for North African cafe', async () => {
    const result = await inferAmbianceFromStoreData({
      store_photos: null,
      notes: 'North African-inspired cafe with terracotta pots, sand-colored plaster walls, clay tiles. Warm afternoon sun through arched windows.',
      area: 'Al Quoz',
      business_subtype: 'cafe',
    });

    expect(result).not.toBeNull();
    expect(result!.surfaces).toBe('plaster');
    expect(result!.colorPalette).toBe('earthy_terracotta');
  });

  it('infers bright_airy + natural_daylight for a family-friendly cafe', async () => {
    const result = await inferAmbianceFromStoreData({
      store_photos: null,
      notes: 'Bright open family-friendly cafe with natural light, big windows, casual atmosphere. Friendly staff, cheerful decor.',
      area: 'JBR',
      business_subtype: 'cafe',
    });

    expect(result).not.toBeNull();
    expect(result!.lighting).toBe('bright_airy');
  });

  it('returns null when notes are empty', async () => {
    const result = await inferAmbianceFromStoreData({
      store_photos: null,
      notes: '',
      area: '',
      business_subtype: '',
    });

    expect(result).toBeNull();
  });

  it('returns null when only 1 keyword matches (threshold is 2)', async () => {
    const result = await inferAmbianceFromStoreData({
      store_photos: null,
      notes: 'A restaurant.',
      area: '',
      business_subtype: '',
    });

    expect(result).toBeNull();
  });
});

describe('ambianceFor — priority resolution', () => {

  it('uses explicit ambiance fields when set', async () => {
    const result = await ambianceFor({
      ambiance_lighting: 'dim_moody',
      ambiance_surfaces: 'wood',
      ambiance_colorPalette: 'warm_golden',
      ambiance_mood: 'speakeasy_moody',
      ambiance_timeOfDay: 'night',
      template: 'restaurant-luxury',
      business_subtype: 'japanese',
      notes: 'This should be ignored because explicit fields are set',
    });

    expect(result.lighting).toBe('dim_moody');
    expect(result.surfaces).toBe('wood');
    expect(result.colorPalette).toBe('warm_golden');
    expect(result.mood).toBe('speakeasy_moody');
    expect(result.timeOfDay).toBe('night');
  });

  it('falls back to template default when no data available', async () => {
    const result = await ambianceFor({
      template: 'restaurant-luxury',
      business_subtype: 'cafe',
    });

    // restaurant-luxury default
    expect(result.lighting).toBe('cool_neutral');
    expect(result.surfaces).toBe('marble');
  });

  it('applies subtype override for steakhouse (no notes = no keyword inference)', async () => {
    const result = await ambianceFor({
      template: 'restaurant-luxury',
      business_subtype: 'steakhouse',
      notes: null,
      source_photos: null,
    });

    // With no notes/photos, falls through to template default + subtype override
    expect(result.surfaces).toBe('mixed_modern');
    expect(result.timeOfDay).toBe('night');
  });
});
