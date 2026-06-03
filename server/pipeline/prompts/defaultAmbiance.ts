/**
 * Default ambiance resolver — ZIP-faithful translation of lib/prompts/defaultAmbiance.ts
 *
 * Priority:
 *   1. Explicit lead ambiance fields (set by team or operator)
 *   2. inferAmbianceFromStoreData (Method B vision + Method A keywords)
 *   3. Template-based default with restaurant subtype refinement
 *
 * Per Hayari spec: DEFAULT_AMBIANCE_BY_TEMPLATE is the LAST resort, not the main path.
 */

import type { AmbianceProfile } from '../../../shared/ambiance';
import { inferAmbianceFromStoreData } from './inferAmbiance';

type TemplateId =
  | 'restaurant'
  | 'restaurant-luxury'
  | 'restaurant-casual'
  | 'salon-luxury'
  | 'salon-casual'
  | 'clinic';

// ─── Template-based defaults (last resort) ────────────────────────────────────

const restaurantLuxuryAmbiance: AmbianceProfile = {
  lighting: 'cool_neutral',
  surfaces: 'marble',
  colorPalette: 'cool_neutral',
  mood: 'refined_minimal',
  timeOfDay: 'midday',
};

const restaurantCasualAmbiance: AmbianceProfile = {
  lighting: 'natural_daylight',
  surfaces: 'wood',
  colorPalette: 'earthy_natural',
  mood: 'bright_casual',
  timeOfDay: 'morning',
};

const DEFAULT_AMBIANCE_BY_TEMPLATE: Record<TemplateId, AmbianceProfile> = {
  restaurant: restaurantLuxuryAmbiance,
  'restaurant-luxury': restaurantLuxuryAmbiance,
  'restaurant-casual': restaurantCasualAmbiance,
  'salon-luxury': {
    lighting: 'natural_daylight',
    surfaces: 'marble',
    colorPalette: 'cool_neutral',
    mood: 'refined_minimal',
    timeOfDay: 'afternoon',
  },
  'salon-casual': {
    lighting: 'bright_airy',
    surfaces: 'wood',
    colorPalette: 'pastel_soft',
    mood: 'cozy_warm',
    timeOfDay: 'afternoon',
  },
  clinic: {
    lighting: 'cool_neutral',
    surfaces: 'mixed_modern',
    colorPalette: 'cool_neutral',
    mood: 'clinical_clean',
    timeOfDay: 'midday',
  },
};

// ─── Restaurant subtype overrides ─────────────────────────────────────────────

const RESTAURANT_AMBIANCE_BY_SUBTYPE: Partial<Record<string, Partial<AmbianceProfile>>> = {
  cafe: {
    // inherits restaurant-luxury base (cool/marble/refined_minimal/midday)
  },
  steakhouse: {
    surfaces: 'mixed_modern',
    timeOfDay: 'night',
  },
  french: {
    surfaces: 'mixed_modern',
    timeOfDay: 'night',
  },
  breakfast: {
    lighting: 'natural_daylight',
    surfaces: 'wood',
    colorPalette: 'earthy_natural',
    mood: 'bright_casual',
    timeOfDay: 'morning',
  },
  burger: {
    lighting: 'natural_daylight',
    surfaces: 'wood',
    colorPalette: 'earthy_natural',
    mood: 'bright_casual',
    timeOfDay: 'midday',
  },
  vegan: {
    lighting: 'bright_airy',
    surfaces: 'wood',
    colorPalette: 'earthy_natural',
    mood: 'cozy_warm',
    timeOfDay: 'midday',
  },
  japanese: {
    surfaces: 'wood',
  },
  sushi: {
    surfaces: 'wood',
  },
};

// ─── Main resolver ────────────────────────────────────────────────────────────

export interface AmbianceLookupInput {
  // Explicit ambiance fields (from lead DB columns)
  ambiance_lighting?: string | null;
  ambiance_surfaces?: string | null;
  ambiance_colorPalette?: string | null;
  ambiance_mood?: string | null;
  ambiance_timeOfDay?: string | null;
  palette_accent?: string | null;
  // Template & subtype
  template?: string | null;
  business_subtype?: string | null;
  business_type?: string | null;
  // Store data for inference
  source_photos?: string[] | null;
  photo_urls?: string[] | null;
  notes?: string | null;
  area?: string | null;
}

/**
 * Resolve the ambiance for a lead.
 *
 * Priority:
 *   1. Explicit lead.ambiance fields (set by team or operator)
 *   2. inferAmbianceFromStoreData (vision + keywords)
 *   3. Template-based default with restaurant subtype refinement
 */
export async function ambianceFor(lead: AmbianceLookupInput): Promise<AmbianceProfile> {
  // 1. If explicit ambiance fields are set, use them
  if (lead.ambiance_lighting || lead.ambiance_surfaces || lead.ambiance_colorPalette || lead.ambiance_mood || lead.ambiance_timeOfDay) {
    const base = getTemplateDefault(lead.template, lead.business_subtype);
    return {
      ...base,
      ...(lead.ambiance_lighting ? { lighting: lead.ambiance_lighting as AmbianceProfile['lighting'] } : {}),
      ...(lead.ambiance_surfaces ? { surfaces: lead.ambiance_surfaces as AmbianceProfile['surfaces'] } : {}),
      ...(lead.ambiance_colorPalette ? { colorPalette: lead.ambiance_colorPalette as AmbianceProfile['colorPalette'] } : {}),
      ...(lead.ambiance_mood ? { mood: lead.ambiance_mood as AmbianceProfile['mood'] } : {}),
      ...(lead.ambiance_timeOfDay ? { timeOfDay: lead.ambiance_timeOfDay as AmbianceProfile['timeOfDay'] } : {}),
      ...(lead.palette_accent ? { accentColor: lead.palette_accent } : {}),
    };
  }

  // 2. Infer from store data (photos + notes + area)
  const photos = lead.source_photos || lead.photo_urls || null;
  const inferred = await inferAmbianceFromStoreData({
    store_photos: photos,
    notes: lead.notes,
    area: lead.area,
    business_subtype: lead.business_subtype,
  });

  if (inferred) {
    const base = getTemplateDefault(lead.template, lead.business_subtype);
    return { ...base, ...inferred };
  }

  // 3. Template-based fallback (last resort)
  return getTemplateDefault(lead.template, lead.business_subtype);
}

/**
 * Get the template-based default ambiance with subtype refinement.
 */
function getTemplateDefault(template?: string | null, businessSubtype?: string | null): AmbianceProfile {
  const templateId = (template ?? 'restaurant') as TemplateId;
  const base =
    DEFAULT_AMBIANCE_BY_TEMPLATE[templateId] ??
    DEFAULT_AMBIANCE_BY_TEMPLATE.restaurant;

  // Restaurant subtype overrides
  const isRestaurantFamily =
    templateId === 'restaurant' ||
    templateId === 'restaurant-luxury' ||
    templateId === 'restaurant-casual';

  if (isRestaurantFamily && businessSubtype) {
    const subtypeOverride = RESTAURANT_AMBIANCE_BY_SUBTYPE[businessSubtype];
    if (subtypeOverride) {
      return { ...base, ...subtypeOverride };
    }
  }

  return base;
}

/**
 * Synchronous version for cases where async is not possible.
 * Uses only explicit fields + template fallback (no inference).
 */
export function ambianceForSync(lead: AmbianceLookupInput): AmbianceProfile {
  if (lead.ambiance_lighting || lead.ambiance_surfaces || lead.ambiance_colorPalette || lead.ambiance_mood || lead.ambiance_timeOfDay) {
    const base = getTemplateDefault(lead.template, lead.business_subtype);
    return {
      ...base,
      ...(lead.ambiance_lighting ? { lighting: lead.ambiance_lighting as AmbianceProfile['lighting'] } : {}),
      ...(lead.ambiance_surfaces ? { surfaces: lead.ambiance_surfaces as AmbianceProfile['surfaces'] } : {}),
      ...(lead.ambiance_colorPalette ? { colorPalette: lead.ambiance_colorPalette as AmbianceProfile['colorPalette'] } : {}),
      ...(lead.ambiance_mood ? { mood: lead.ambiance_mood as AmbianceProfile['mood'] } : {}),
      ...(lead.ambiance_timeOfDay ? { timeOfDay: lead.ambiance_timeOfDay as AmbianceProfile['timeOfDay'] } : {}),
      ...(lead.palette_accent ? { accentColor: lead.palette_accent } : {}),
    };
  }

  return getTemplateDefault(lead.template, lead.business_subtype);
}
