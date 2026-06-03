/**
 * inferAmbianceFromStoreData — Store-driven ambiance inference.
 *
 * Priority:
 *   Method B: If store_photos are available, use LLM vision to analyze the image.
 *   Method A: If no photos but notes exist, use keyword matching.
 *   Fallback: Returns null (caller uses template-based default).
 *
 * Per Hayari spec: "最低でも方法 A、できれば方法 B を実装してください"
 */

import type {
  AmbianceProfile,
  AmbianceLighting,
  AmbianceSurfaces,
  AmbianceColorPalette,
  AmbianceMood,
  AmbianceTimeOfDay,
  AmbianceDensity,
  AmbianceTextureEmphasis,
} from '../../../shared/ambiance';
import { invokeLLM } from '../../_core/llm';

// ─── Method A: Keyword matching ───────────────────────────────────────────────

const LIGHTING_KEYWORDS: Record<AmbianceLighting, string[]> = {
  warm_tungsten: ['intimate', 'evening', 'dim', 'cozy', 'warm light', 'tungsten', 'candlelit', 'amber'],
  cool_neutral: ['modern', 'minimal', 'clean', 'editorial', 'refined', 'neutral', 'sleek'],
  natural_daylight: ['bright', 'natural light', 'window', 'sunny', 'airy', 'daylight', 'sunlit'],
  dim_moody: ['moody', 'dark', 'speakeasy', 'hushed', 'cocktail bar', 'lounge', 'underground'],
  bright_airy: ['bright', 'open', 'friendly', 'family', 'casual', 'cheerful', 'light-filled'],
  golden_hour: ['golden', 'sunset', 'terrace', 'rooftop', 'warm glow'],
};

const SURFACES_KEYWORDS: Record<AmbianceSurfaces, string[]> = {
  marble: ['marble', 'stone', 'polished', 'terrazzo', 'quartz'],
  wood: ['wood', 'wooden', 'timber', 'oak', 'walnut', 'teak', 'cedar'],
  concrete: ['concrete', 'industrial', 'raw', 'brutalist', 'cement'],
  tile: ['tile', 'ceramic', 'mosaic', 'zellige', 'pattern'],
  velvet_fabric: ['velvet', 'fabric', 'upholstery', 'plush', 'cushion', 'textile'],
  mixed_modern: ['mixed', 'glass', 'metal', 'steel', 'chrome', 'contemporary'],
  plaster: ['plaster', 'stucco', 'lime wash', 'clay', 'adobe', 'earthen'],
  brick: ['brick', 'exposed brick', 'red brick', 'masonry'],
};

const COLOR_PALETTE_KEYWORDS: Record<AmbianceColorPalette, string[]> = {
  warm_golden: ['golden', 'amber', 'honey', 'brass', 'warm tones'],
  cool_neutral: ['neutral', 'grey', 'white', 'minimal', 'monochrome', 'clean'],
  monochrome: ['black and white', 'monochrome', 'high contrast', 'b&w'],
  earthy_natural: ['earth', 'natural', 'organic', 'green', 'plant'],
  earthy_terracotta: ['terracotta', 'rust', 'clay', 'burnt orange', 'ochre', 'sand', 'desert'],
  pastel_soft: ['pastel', 'soft', 'blush', 'lavender', 'mint', 'powder'],
  bold_vibrant: ['vibrant', 'bold', 'colorful', 'neon', 'pop', 'bright color'],
  natural_color: ['natural color', 'true color', 'authentic', 'warm wood'],
  breeze_blue: ['blue', 'ocean', 'sea', 'coastal', 'marine', 'nautical', 'mediterranean'],
  soft_green: ['green', 'botanical', 'garden', 'forest', 'sage', 'olive'],
};

const MOOD_KEYWORDS: Record<AmbianceMood, string[]> = {
  intimate_upscale: ['intimate', 'upscale', 'luxury', 'exclusive', 'fine dining', 'premium'],
  bright_casual: ['casual', 'friendly', 'relaxed', 'laid-back', 'everyday', 'neighborhood'],
  cozy_warm: ['cozy', 'warm', 'homey', 'comfort', 'hygge', 'snug'],
  clinical_clean: ['clinical', 'pristine', 'sterile', 'medical', 'spa', 'wellness'],
  energetic_modern: ['energetic', 'vibrant', 'dynamic', 'buzzing', 'lively', 'trendy'],
  refined_minimal: ['refined', 'minimal', 'understated', 'elegant', 'sophisticated'],
  refined: ['refined', 'elegant', 'sophisticated', 'tasteful'],
  editorial_minimal: ['editorial', 'magazine', 'curated', 'gallery', 'art'],
  speakeasy_moody: ['speakeasy', 'hidden', 'secret', 'underground', 'prohibition', 'jazz'],
};

const TIME_KEYWORDS: Record<AmbianceTimeOfDay, string[]> = {
  morning: ['morning', 'breakfast', 'brunch', 'early', 'sunrise', 'dawn'],
  midday: ['midday', 'lunch', 'noon', 'daytime', 'day-focused'],
  afternoon: ['afternoon', 'tea', 'high tea', 'siesta'],
  evening: ['evening', 'dinner', 'sunset', 'dusk', 'twilight'],
  night: ['night', 'nightlife', 'late', 'midnight', 'after dark', 'bar'],
};

const DENSITY_KEYWORDS: Record<AmbianceDensity, string[]> = {
  airy: ['spacious', 'open', 'minimal', 'breathing room', 'airy', 'wide'],
  compact: ['compact', 'cozy', 'intimate', 'small', 'tight', 'dense'],
  editorial: ['editorial', 'gallery', 'curated', 'magazine', 'artistic'],
};

const TEXTURE_KEYWORDS: Record<AmbianceTextureEmphasis, string[]> = {
  tactile: ['textured', 'tactile', 'rough', 'handmade', 'artisan', 'craft', 'woven'],
  smooth: ['smooth', 'polished', 'glossy', 'sleek', 'lacquer'],
  minimal: ['minimal', 'flat', 'clean lines', 'simple'],
};

function matchKeywords<T extends string>(
  text: string,
  keywordMap: Record<T, string[]>,
): T | null {
  const lower = text.toLowerCase();
  let bestKey: T | null = null;
  let bestCount = 0;

  for (const [key, keywords] of Object.entries(keywordMap) as [T, string[]][]) {
    let count = 0;
    for (const kw of keywords) {
      // Use word boundary regex to avoid false positives like 'steakhouse' matching 'teak'
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i');
      if (regex.test(lower)) count++;
    }
    if (count > bestCount) {
      bestCount = count;
      bestKey = key;
    }
  }

  return bestCount > 0 ? bestKey : null;
}

/**
 * Method A: Infer ambiance from notes + area + business_subtype via keyword matching.
 */
function inferFromKeywords(lead: InferInput): Partial<AmbianceProfile> | null {
  const text = [lead.notes, lead.area, lead.business_subtype].filter(Boolean).join(' ');
  if (!text.trim()) return null;

  const lighting = matchKeywords(text, LIGHTING_KEYWORDS);
  const surfaces = matchKeywords(text, SURFACES_KEYWORDS);
  const colorPalette = matchKeywords(text, COLOR_PALETTE_KEYWORDS);
  const mood = matchKeywords(text, MOOD_KEYWORDS);
  const timeOfDay = matchKeywords(text, TIME_KEYWORDS);
  const density = matchKeywords(text, DENSITY_KEYWORDS);
  const textureEmphasis = matchKeywords(text, TEXTURE_KEYWORDS);

  // If at least 2 fields matched, we have a meaningful inference
  const matched = [lighting, surfaces, colorPalette, mood, timeOfDay].filter(Boolean).length;
  if (matched < 2) return null;

  const result: Partial<AmbianceProfile> = {};
  if (lighting) result.lighting = lighting;
  if (surfaces) result.surfaces = surfaces;
  if (colorPalette) result.colorPalette = colorPalette;
  if (mood) result.mood = mood;
  if (timeOfDay) result.timeOfDay = timeOfDay;
  if (density) result.density = density;
  if (textureEmphasis) result.textureEmphasis = textureEmphasis;

  return result;
}

// ─── Method B: LLM vision analysis ───────────────────────────────────────────

const VISION_PROMPT = `Analyze this store/restaurant photo and infer the ambiance profile.
Return ONLY valid JSON with these fields:

{
  "lighting": one of "warm_tungsten" | "cool_neutral" | "natural_daylight" | "dim_moody" | "bright_airy" | "golden_hour",
  "surfaces": one of "marble" | "wood" | "concrete" | "tile" | "velvet_fabric" | "mixed_modern" | "plaster" | "brick",
  "colorPalette": one of "warm_golden" | "cool_neutral" | "monochrome" | "earthy_natural" | "earthy_terracotta" | "pastel_soft" | "bold_vibrant" | "natural_color" | "breeze_blue" | "soft_green",
  "mood": one of "intimate_upscale" | "bright_casual" | "cozy_warm" | "clinical_clean" | "energetic_modern" | "refined_minimal" | "editorial_minimal" | "speakeasy_moody",
  "timeOfDay": one of "morning" | "midday" | "afternoon" | "evening" | "night",
  "accentColor": a HEX color string (e.g. "#B0552F") representing the dominant accent color visible in the space,
  "density": one of "airy" | "compact" | "editorial",
  "textureEmphasis": one of "tactile" | "smooth" | "minimal"
}

Base your analysis on:
- The actual lighting visible in the photo (color temperature, brightness, direction)
- The dominant surface materials visible (counters, walls, floors, furniture)
- The overall color palette of the space
- The mood/atmosphere conveyed
- Whether it appears to be a morning/daytime/evening/night setting
- The amount of space/breathing room vs density
- How much texture is emphasized in the design

Return ONLY the JSON object, no explanation.`;

/**
 * Method B: Analyze a store photo using LLM vision to infer ambiance.
 */
async function inferFromVision(photoUrl: string): Promise<Partial<AmbianceProfile> | null> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: photoUrl, detail: 'low' } },
            { type: 'text', text: VISION_PROMPT },
          ],
        },
      ],
    });

    const rawContent = response.choices?.[0]?.message?.content;
    if (!rawContent) return null;

    const content = typeof rawContent === 'string' ? rawContent : '';
    if (!content) return null;

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and return only valid fields
    const result: Partial<AmbianceProfile> = {};
    if (parsed.lighting) result.lighting = parsed.lighting;
    if (parsed.surfaces) result.surfaces = parsed.surfaces;
    if (parsed.colorPalette) result.colorPalette = parsed.colorPalette;
    if (parsed.mood) result.mood = parsed.mood;
    if (parsed.timeOfDay) result.timeOfDay = parsed.timeOfDay;
    if (parsed.accentColor && /^#[0-9A-Fa-f]{6}$/.test(parsed.accentColor)) {
      result.accentColor = parsed.accentColor;
    }
    if (parsed.density) result.density = parsed.density;
    if (parsed.textureEmphasis) result.textureEmphasis = parsed.textureEmphasis;

    return result;
  } catch (err) {
    console.warn('[inferAmbiance] Vision analysis failed:', err);
    return null;
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export interface InferInput {
  store_photos?: string[] | null;
  notes?: string | null;
  area?: string | null;
  business_subtype?: string | null;
}

/**
 * Infer ambiance from store data.
 *
 * Priority:
 *   1. Method B (vision) — if store_photos available
 *   2. Method A (keywords) — if notes/area/subtype available
 *   3. null — caller falls back to template default
 */
export async function inferAmbianceFromStoreData(
  lead: InferInput,
): Promise<Partial<AmbianceProfile> | null> {
  // Method B: Vision analysis (preferred)
  if (lead.store_photos && lead.store_photos.length > 0) {
    const visionResult = await inferFromVision(lead.store_photos[0]);
    if (visionResult) {
      // Supplement with keyword matching for any missing fields
      const keywordResult = inferFromKeywords(lead);
      if (keywordResult) {
        return { ...keywordResult, ...visionResult };
      }
      return visionResult;
    }
  }

  // Method A: Keyword matching fallback
  return inferFromKeywords(lead);
}
