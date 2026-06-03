/**
 * Ambiance type definitions — extended AmbianceProfile.
 *
 * Translated from ZIP: lib/types/ambiance.ts
 * Extended per Hayari spec with accentColor, density, textureEmphasis.
 */

export type AmbianceLighting =
  | 'warm_tungsten'
  | 'natural_daylight'
  | 'cool_neutral'
  | 'dim_moody'
  | 'bright_airy'
  | 'golden_hour';

export type AmbianceSurfaces =
  | 'marble'
  | 'wood'
  | 'concrete'
  | 'tile'
  | 'velvet_fabric'
  | 'mixed_modern'
  | 'plaster'
  | 'brick';

export type AmbianceColorPalette =
  | 'warm_golden'
  | 'cool_neutral'
  | 'monochrome'
  | 'earthy_natural'
  | 'earthy_terracotta'
  | 'pastel_soft'
  | 'bold_vibrant'
  | 'natural_color'
  | 'breeze_blue'
  | 'soft_green';

export type AmbianceMood =
  | 'intimate_upscale'
  | 'bright_casual'
  | 'cozy_warm'
  | 'clinical_clean'
  | 'energetic_modern'
  | 'refined_minimal'
  | 'refined'
  | 'editorial_minimal'
  | 'speakeasy_moody';

export type AmbianceTimeOfDay =
  | 'morning'
  | 'midday'
  | 'afternoon'
  | 'evening'
  | 'night';

export type AmbianceDensity = 'airy' | 'compact' | 'editorial';
export type AmbianceTextureEmphasis = 'tactile' | 'smooth' | 'minimal';

export interface AmbianceProfile {
  lighting: AmbianceLighting;
  surfaces: AmbianceSurfaces;
  colorPalette: AmbianceColorPalette;
  mood: AmbianceMood;
  timeOfDay: AmbianceTimeOfDay;
  /** Free-form English-only notes. Always written into the prompt verbatim. */
  customNotes?: string;
  /** HEX accent color extracted from store photos or inferred. */
  accentColor?: string;
  /** Layout density — how much whitespace the design uses. */
  density?: AmbianceDensity;
  /** How much tactile texture is emphasized in visuals. */
  textureEmphasis?: AmbianceTextureEmphasis;
}
