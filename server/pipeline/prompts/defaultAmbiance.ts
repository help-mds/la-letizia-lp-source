/**
 * Default ambiance resolver.
 *
 * Faithfully translated from ZIP: lib/prompts/defaultAmbiance.ts
 *
 * When a lead does not have explicit ambiance fields set,
 * this module provides sensible defaults based on business_type + business_subtype.
 */

import type { AmbianceConfig } from './ambiance';

type BusinessKey = string; // e.g. "restaurant/cafe", "salon/hair"

const DEFAULTS: Record<BusinessKey, AmbianceConfig> = {
  'restaurant/cafe': {
    lighting: 'cool_neutral',
    surfaces: 'marble',
    colorPalette: 'cool_neutral',
    mood: 'refined',
    timeOfDay: 'midday',
  },
  'restaurant/fine_dining': {
    lighting: 'warm_ambient',
    surfaces: 'wood',
    colorPalette: 'warm_earth',
    mood: 'refined',
    timeOfDay: 'evening',
  },
  'restaurant/casual': {
    lighting: 'natural',
    surfaces: 'mixed',
    colorPalette: 'warm_earth',
    mood: 'cozy',
    timeOfDay: 'midday',
  },
  'salon/hair': {
    lighting: 'cool_neutral',
    surfaces: 'mixed',
    colorPalette: 'monochrome',
    mood: 'refined',
    timeOfDay: 'midday',
  },
  'salon/spa': {
    lighting: 'warm_ambient',
    surfaces: 'wood',
    colorPalette: 'warm_earth',
    mood: 'serene',
    timeOfDay: 'morning',
  },
};

const FALLBACK: AmbianceConfig = {
  lighting: 'natural',
  surfaces: 'mixed',
  colorPalette: 'cool_neutral',
  mood: 'refined',
  timeOfDay: 'midday',
};

/**
 * Resolves ambiance config for a lead.
 * If the lead has explicit ambiance fields, those are used.
 * Otherwise, falls back to defaults based on business type/subtype.
 */
export function resolveAmbiance(
  lead: {
    business_type?: string | null;
    business_subtype?: string | null;
    ambiance_lighting?: string | null;
    ambiance_surfaces?: string | null;
    ambiance_colorPalette?: string | null;
    ambiance_mood?: string | null;
    ambiance_timeOfDay?: string | null;
  },
): AmbianceConfig {
  // If lead has explicit ambiance fields, use them
  if (lead.ambiance_lighting || lead.ambiance_surfaces || lead.ambiance_colorPalette || lead.ambiance_mood || lead.ambiance_timeOfDay) {
    return {
      lighting: lead.ambiance_lighting ?? FALLBACK.lighting,
      surfaces: lead.ambiance_surfaces ?? FALLBACK.surfaces,
      colorPalette: lead.ambiance_colorPalette ?? FALLBACK.colorPalette,
      mood: lead.ambiance_mood ?? FALLBACK.mood,
      timeOfDay: lead.ambiance_timeOfDay ?? FALLBACK.timeOfDay,
    };
  }

  // Otherwise, use defaults based on business type
  const key = [lead.business_type, lead.business_subtype].filter(Boolean).join('/');
  return DEFAULTS[key] ?? FALLBACK;
}
