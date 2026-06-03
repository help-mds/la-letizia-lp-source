/**
 * Leads tRPC router — public procedures for demo LP rendering and lead creation.
 *
 * Faithfully translated from ZIP: app/api/leads/route.ts
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { publicProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { leads } from '../../drizzle/schema';
import { runPipeline } from '../pipeline/index';

export const leadsRouter = router({
  /**
   * Get a lead by slug — used by the public demo page /r/:slug.
   * No authentication required.
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.slug, input.slug))
        .limit(1);

      return lead || null;
    }),

  /**
   * Create a new lead and optionally trigger the pipeline.
   * No authentication required (used by Pakistan team via /input).
   */
  create: publicProcedure
    .input(
      z.object({
        store_name: z.string().min(1),
        business_type: z.enum(['restaurant', 'salon']),
        area: z.string().min(1),
        business_subtype: z.string().optional(),
        google_maps_url: z.string().url().optional(),
        current_website_url: z.string().url().optional(),
        instagram_url: z.string().url().optional(),
        email: z.string().email().optional(),
        whatsapp_number: z.string().optional(),
        phone_number: z.string().optional(),
        logo_url: z.string().url().optional(),
        photo_urls: z.array(z.string().url()).optional(),
        screenshot_urls: z.array(z.string().url()).optional(),
        source_photos: z.array(z.string().url()).optional(),
        notes: z.string().optional(),
        // Template & ambiance
        template: z.string().optional(),
        ambiance_lighting: z.string().optional(),
        ambiance_surfaces: z.string().optional(),
        ambiance_color_palette: z.string().optional(),
        ambiance_mood: z.string().optional(),
        ambiance_time_of_day: z.string().optional(),
        // Pre-set content
        hero_tagline: z.string().optional(),
        hero_subtitle: z.string().optional(),
        story_paragraphs: z.array(z.string()).optional(),
        atmosphere_caption: z.string().optional(),
        cta_title: z.string().optional(),
        cta_subtitle: z.string().optional(),
        palette_accent: z.string().optional(),
        gallery_images: z.array(z.string()).optional(),
        gallery_captions: z.array(z.string()).optional(),
        info_address: z.string().optional(),
        info_hours: z.string().optional(),
        info_phone: z.string().optional(),
        info_reservation_url: z.string().optional(),
        menu_items: z.array(z.object({
          name: z.string(),
          desc: z.string().optional(),
          price: z.string().optional(),
        })).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const slug = buildSlug(input.store_name, input.area);

      const [inserted] = await db.insert(leads).values({
        storeName: input.store_name,
        area: input.area,
        businessType: input.business_type,
        businessSubtype: input.business_subtype,
        slug,
        status: 'NEW_LEAD',
        googleMapsUrl: input.google_maps_url,
        currentWebsiteUrl: input.current_website_url,
        instagramUrl: input.instagram_url,
        email: input.email,
        whatsappNumber: input.whatsapp_number,
        phoneNumber: input.phone_number,
        logoUrl: input.logo_url,
        photoUrls: input.photo_urls,
        screenshotUrls: input.screenshot_urls,
        sourcePhotos: input.source_photos,
        notes: input.notes,
        template: input.template,
        ambianceLighting: input.ambiance_lighting,
        ambianceSurfaces: input.ambiance_surfaces,
        ambianceColorPalette: input.ambiance_color_palette,
        ambianceMood: input.ambiance_mood,
        ambianceTimeOfDay: input.ambiance_time_of_day,
        heroTagline: input.hero_tagline,
        heroSubtitle: input.hero_subtitle,
        storyParagraphs: input.story_paragraphs,
        atmosphereCaption: input.atmosphere_caption,
        ctaTitle: input.cta_title,
        ctaSubtitle: input.cta_subtitle,
        paletteAccent: input.palette_accent,
        galleryImages: input.gallery_images,
        galleryCaptions: input.gallery_captions,
        infoAddress: input.info_address,
        infoHours: input.info_hours,
        infoPhone: input.info_phone,
        infoReservationUrl: input.info_reservation_url,
        menuItems: input.menu_items,
      }).$returningId();

      // Fire-and-forget pipeline
      setImmediate(async () => {
        try {
          await runPipeline(inserted.id);
        } catch (err) {
          console.error(`[pipeline] lead=${inserted.id} failed:`, err);
          await db.update(leads).set({ status: 'PIPELINE_FAILED' }).where(eq(leads.id, inserted.id));
        }
      });

      return {
        id: inserted.id,
        slug,
        status: 'NEW_LEAD',
      };
    }),

  /**
   * Manually trigger pipeline for an existing lead.
   */
  triggerPipeline: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      setImmediate(async () => {
        try {
          await runPipeline(input.id);
        } catch (err) {
          console.error(`[pipeline] lead=${input.id} failed:`, err);
        }
      });
      return { triggered: true };
    }),
});

/**
 * Build a URL-safe slug from store name and area.
 * Translated from ZIP: lib/utils/slug.ts
 */
function buildSlug(storeName: string, area?: string): string {
  const parts = [kebab(storeName)];
  if (area) parts.push(kebab(area));
  // 6-char random suffix
  const suffix = Math.random().toString(36).slice(2, 8);
  parts.push(suffix);
  return parts.join('-');
}

function kebab(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}
