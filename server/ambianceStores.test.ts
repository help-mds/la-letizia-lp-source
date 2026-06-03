import { describe, expect, it } from 'vitest';
import { ambianceFor } from './pipeline/prompts/defaultAmbiance';

/**
 * Test different store profiles to verify ambiance inference produces
 * clearly different outputs for different business types.
 */
describe('Store-driven ambiance — different store profiles', () => {
  it('La Letizia (modern minimal cafe, cool daylight, marble)', async () => {
    const result = await ambianceFor({
      template: 'restaurant-luxury',
      business_subtype: 'cafe',
      notes: 'Modern minimal cafe along Dubai Marina. Marble counters, slow coffee, daytime culture. Refined but accessible. Day-focused, no nightlife angle.',
      area: 'Dubai Marina',
    });

    expect(result.lighting).toBe('cool_neutral');
    expect(result.surfaces).toBe('marble');
    expect(result.mood).toBe('refined_minimal');
    expect(result.timeOfDay).toBe('midday');
  });

  it('Noor (evening-only Japanese izakaya, dim moody, wood)', async () => {
    const result = await ambianceFor({
      template: 'restaurant-luxury',
      business_subtype: 'japanese',
      notes: 'Intimate evening-only omakase counter. Dark wooden interior, warm dim lighting, hushed atmosphere. Speakeasy-style hidden entrance in DIFC. 8 seats only.',
      area: 'DIFC',
    });

    // Should be clearly different from La Letizia
    expect(result.lighting).not.toBe('cool_neutral');
    expect(result.surfaces).toBe('wood');
    expect(['dim_moody', 'warm_tungsten']).toContain(result.lighting);
    expect(['evening', 'night']).toContain(result.timeOfDay);
  });

  it('Sahara Brew (North African cafe, earthy terracotta, plaster)', async () => {
    const result = await ambianceFor({
      template: 'restaurant-luxury',
      business_subtype: 'cafe',
      notes: 'North African-inspired specialty coffee. Terracotta pots, sand-colored plaster walls, clay tiles. Warm afternoon sun through arched windows. Moroccan mint tea and pour-over coffee.',
      area: 'Al Quoz',
    });

    // Should be clearly different from both La Letizia and Noor
    expect(result.surfaces).toBe('plaster');
    expect(result.colorPalette).toBe('earthy_terracotta');
    expect(['afternoon', 'midday']).toContain(result.timeOfDay);
  });

  it('All three stores produce distinct ambiance profiles', async () => {
    const laLetizia = await ambianceFor({
      template: 'restaurant-luxury',
      business_subtype: 'cafe',
      notes: 'Modern minimal cafe along Dubai Marina. Marble counters, slow coffee, daytime culture.',
      area: 'Dubai Marina',
    });

    const noor = await ambianceFor({
      template: 'restaurant-luxury',
      business_subtype: 'japanese',
      notes: 'Intimate evening-only omakase counter. Dark wooden interior, warm dim lighting, hushed atmosphere.',
      area: 'DIFC',
    });

    const saharaBrew = await ambianceFor({
      template: 'restaurant-luxury',
      business_subtype: 'cafe',
      notes: 'North African-inspired specialty coffee. Terracotta pots, sand-colored plaster walls, clay tiles.',
      area: 'Al Quoz',
    });

    // All three should have different lighting
    const lightings = new Set([laLetizia.lighting, noor.lighting, saharaBrew.lighting]);
    expect(lightings.size).toBeGreaterThanOrEqual(2);

    // All three should have different surfaces
    const surfaces = new Set([laLetizia.surfaces, noor.surfaces, saharaBrew.surfaces]);
    expect(surfaces.size).toBe(3);

    // La Letizia = marble, Noor = wood, Sahara Brew = plaster
    expect(laLetizia.surfaces).toBe('marble');
    expect(noor.surfaces).toBe('wood');
    expect(saharaBrew.surfaces).toBe('plaster');
  });
});
