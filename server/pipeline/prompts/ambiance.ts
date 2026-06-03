/**
 * Ambiance phrase mapper for video/image prompt construction.
 *
 * Faithfully translated from ZIP: lib/prompts/ambiance.ts
 * Extended with new enum values per Hayari spec.
 */

import type {
  AmbianceProfile,
  AmbianceLighting,
  AmbianceSurfaces,
  AmbianceColorPalette,
  AmbianceMood,
  AmbianceTimeOfDay,
} from '../../../shared/ambiance';

const LIGHTING_PHRASE: Record<AmbianceLighting, string> = {
  warm_tungsten: 'warm tungsten-lit',
  natural_daylight: 'bright daylight-filled',
  cool_neutral: 'cool neutral-lit',
  dim_moody: 'dim moody-lit',
  bright_airy: 'bright airy',
  golden_hour: 'golden hour-lit',
};

const SURFACES_PHRASE: Record<AmbianceSurfaces, string> = {
  marble: 'marble counters and surfaces',
  wood: 'warm wooden surfaces',
  concrete: 'polished concrete surfaces',
  tile: 'patterned tiled surfaces',
  velvet_fabric: 'velvet upholstery and rich fabrics',
  mixed_modern: 'mixed modern materials of glass, metal and wood',
  plaster: 'textured plaster and lime-washed walls',
  brick: 'exposed brick walls',
};

const COLOR_PALETTE_PHRASE: Record<AmbianceColorPalette, string> = {
  warm_golden: 'warm golden',
  cool_neutral: 'cool neutral',
  monochrome: 'high-contrast monochrome',
  earthy_natural: 'earthy natural',
  earthy_terracotta: 'earthy terracotta and sand tones',
  pastel_soft: 'soft pastel',
  bold_vibrant: 'bold vibrant',
  natural_color: 'natural true-to-life colors',
  breeze_blue: 'coastal blue and white',
  soft_green: 'soft botanical green',
};

const MOOD_PHRASE: Record<AmbianceMood, string> = {
  intimate_upscale: 'intimate upscale',
  bright_casual: 'bright casual',
  cozy_warm: 'cozy and warm',
  clinical_clean: 'clinical and pristine',
  energetic_modern: 'energetic and modern',
  refined_minimal: 'refined and minimal',
  refined: 'refined and elegant',
  editorial_minimal: 'editorial and minimal',
  speakeasy_moody: 'speakeasy moody',
};

const TIME_OF_DAY_PHRASE: Record<AmbianceTimeOfDay, string> = {
  morning: 'morning',
  midday: 'midday',
  afternoon: 'afternoon',
  evening: 'evening',
  night: 'night-time',
};

export interface AmbiancePhrases {
  lighting: string;
  surfaces: string;
  colorPalette: string;
  mood: string;
  timeOfDay: string;
  notes: string;
  articleMood: string;
  articleLighting: string;
  /** Full combined phrase for prompt injection. */
  combined: string;
}

function startsWithVowelSound(s: string): boolean {
  return /^[aeiou]/i.test(s.trim());
}

export function ambiancePhrases(a: AmbianceProfile): AmbiancePhrases {
  const mood = MOOD_PHRASE[a.mood] ?? 'refined and minimal';
  const lighting = LIGHTING_PHRASE[a.lighting] ?? 'cool neutral-lit';
  const surfaces = SURFACES_PHRASE[a.surfaces] ?? 'mixed modern materials';
  const colorPalette = COLOR_PALETTE_PHRASE[a.colorPalette] ?? 'cool neutral';
  const timeOfDay = TIME_OF_DAY_PHRASE[a.timeOfDay] ?? 'midday';
  const notes = a.customNotes?.trim() ?? '';

  const combined = [
    `${lighting} space with ${surfaces}`,
    `${colorPalette} color palette`,
    `${mood} atmosphere`,
    `${timeOfDay} ambient light`,
    notes,
  ].filter(Boolean).join('. ') + '.';

  return {
    lighting,
    surfaces,
    colorPalette,
    mood,
    timeOfDay,
    notes,
    articleMood: startsWithVowelSound(mood) ? 'an' : 'a',
    articleLighting: startsWithVowelSound(lighting) ? 'an' : 'a',
    combined,
  };
}

/**
 * Legacy compatibility: buildAmbiancePhrases for the pipeline.
 * Accepts the old AmbianceConfig format and returns a combined string.
 */
export interface AmbianceConfig {
  lighting: string;
  surfaces: string;
  colorPalette: string;
  mood: string;
  timeOfDay: string;
}

export function buildAmbiancePhrases(config: AmbianceConfig): string {
  const profile: AmbianceProfile = {
    lighting: config.lighting as AmbianceLighting,
    surfaces: config.surfaces as AmbianceSurfaces,
    colorPalette: config.colorPalette as AmbianceColorPalette,
    mood: config.mood as AmbianceMood,
    timeOfDay: config.timeOfDay as AmbianceTimeOfDay,
  };
  return ambiancePhrases(profile).combined;
}
