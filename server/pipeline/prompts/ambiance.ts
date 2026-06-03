/**
 * Ambiance phrase mapper for video prompt construction.
 *
 * Faithfully translated from ZIP: lib/prompts/ambiance.ts
 */

export interface AmbianceConfig {
  lighting: string;
  surfaces: string;
  colorPalette: string;
  mood: string;
  timeOfDay: string;
}

const LIGHTING_MAP: Record<string, string> = {
  cool_neutral: 'Cool neutral daylight filtering through large windows, soft diffused shadows',
  warm_ambient: 'Warm ambient lighting from pendant fixtures, golden hour quality',
  dramatic: 'Dramatic directional lighting with deep shadows and bright highlights',
  natural: 'Natural daylight, clean and even illumination',
};

const SURFACES_MAP: Record<string, string> = {
  marble: 'Polished marble countertops and surfaces with subtle veining',
  wood: 'Warm natural wood surfaces with visible grain',
  concrete: 'Raw concrete and industrial materials',
  mixed: 'Mix of natural materials — wood, stone, metal',
};

const PALETTE_MAP: Record<string, string> = {
  cool_neutral: 'Cool neutral palette — whites, light greys, pale blues',
  warm_earth: 'Warm earth tones — terracotta, sand, cream',
  monochrome: 'Monochromatic palette with subtle tonal variation',
  rich_dark: 'Rich dark palette — deep greens, navy, charcoal',
};

const MOOD_MAP: Record<string, string> = {
  refined: 'Refined and minimal atmosphere, understated elegance',
  cozy: 'Cozy and inviting atmosphere, comfortable warmth',
  energetic: 'Energetic and vibrant atmosphere, dynamic movement',
  serene: 'Serene and calm atmosphere, meditative stillness',
};

const TIME_MAP: Record<string, string> = {
  midday: 'Midday light — bright, clear, high contrast',
  morning: 'Morning light — soft, warm, golden',
  evening: 'Evening light — warm tungsten, intimate',
  golden_hour: 'Golden hour — rich warm directional light',
};

/**
 * Converts ambiance config into a descriptive phrase string for the video prompt.
 */
export function buildAmbiancePhrases(config: AmbianceConfig): string {
  const parts: string[] = [];

  if (config.lighting && LIGHTING_MAP[config.lighting]) {
    parts.push(LIGHTING_MAP[config.lighting]);
  }
  if (config.surfaces && SURFACES_MAP[config.surfaces]) {
    parts.push(SURFACES_MAP[config.surfaces]);
  }
  if (config.colorPalette && PALETTE_MAP[config.colorPalette]) {
    parts.push(PALETTE_MAP[config.colorPalette]);
  }
  if (config.mood && MOOD_MAP[config.mood]) {
    parts.push(MOOD_MAP[config.mood]);
  }
  if (config.timeOfDay && TIME_MAP[config.timeOfDay]) {
    parts.push(TIME_MAP[config.timeOfDay]);
  }

  return parts.join('. ') + '.';
}
