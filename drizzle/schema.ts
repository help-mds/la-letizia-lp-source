import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table — mirrors ZIP's lib/supabase/types.ts Lead interface.
 * Stores all data needed to render a demo LP page.
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  storeName: varchar("store_name", { length: 255 }).notNull(),
  area: varchar("area", { length: 255 }).notNull(),
  businessType: mysqlEnum("business_type", ["restaurant", "salon"]).notNull(),
  businessSubtype: varchar("business_subtype", { length: 100 }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 50 }).notNull().default("NEW_LEAD"),

  // Contact info
  googleMapsUrl: text("google_maps_url"),
  currentWebsiteUrl: text("current_website_url"),
  instagramUrl: text("instagram_url"),
  email: varchar("email", { length: 320 }),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  logoUrl: text("logo_url"),
  photoUrls: json("photo_urls").$type<string[]>(),
  screenshotUrls: json("screenshot_urls").$type<string[]>(),
  sourcePhotos: json("source_photos").$type<string[]>(),
  notes: text("notes"),

  // Template & ambiance
  template: varchar("template", { length: 100 }),
  ambianceLighting: varchar("ambiance_lighting", { length: 50 }),
  ambianceSurfaces: varchar("ambiance_surfaces", { length: 50 }),
  ambianceColorPalette: varchar("ambiance_color_palette", { length: 50 }),
  ambianceMood: varchar("ambiance_mood", { length: 50 }),
  ambianceTimeOfDay: varchar("ambiance_time_of_day", { length: 50 }),
  paletteAccent: varchar("palette_accent", { length: 20 }),
  ambianceDensity: varchar("ambiance_density", { length: 50 }),
  ambianceTextureEmphasis: varchar("ambiance_texture_emphasis", { length: 50 }),
  ambianceAccentColor: varchar("ambiance_accent_color", { length: 20 }),

  // Generated content — hero
  heroTagline: varchar("hero_tagline", { length: 500 }),
  heroSubtitle: text("hero_subtitle"),

  // Generated content — story
  storyParagraphs: json("story_paragraphs").$type<string[]>(),

  // Generated content — menu
  menuItems: json("menu_items").$type<Array<{ name: string; desc?: string; price?: string }>>(),

  // Generated content — atmosphere
  atmosphereCaption: varchar("atmosphere_caption", { length: 500 }),

  // Generated content — gallery
  galleryImages: json("gallery_images").$type<string[]>(),
  galleryCaptions: json("gallery_captions").$type<string[]>(),

  // Generated content — CTA
  ctaTitle: varchar("cta_title", { length: 500 }),
  ctaSubtitle: text("cta_subtitle"),

  // Generated content — info
  infoAddress: text("info_address"),
  infoHours: text("info_hours"),
  infoPhone: varchar("info_phone", { length: 50 }),
  infoReservationUrl: text("info_reservation_url"),

  // Video pipeline results
  videoUrl: text("video_url"),
  videoTaskId: varchar("video_task_id", { length: 255 }),
  videoCostUsd: varchar("video_cost_usd", { length: 20 }),
  framesPathLandscape: text("frames_path_landscape"),
  frameCountLandscape: int("frame_count_landscape"),
  frameUrlsLandscape: json("frame_urls_landscape").$type<string[]>(),
  framesPathPortrait: text("frames_path_portrait"),
  frameCountPortrait: int("frame_count_portrait"),
  frameUrlsPortrait: json("frame_urls_portrait").$type<string[]>(),

  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
