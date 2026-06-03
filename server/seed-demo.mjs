/**
 * Seed script: Insert La Letizia R5 demo data into the leads table.
 * Run with: node server/seed-demo.mjs
 *
 * Uses the DATABASE_URL from the environment.
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const DEMO_SLUG = 'la-letizia-dubai-marina';

const demoLead = {
  store_name: 'La Letizia',
  area: 'Dubai Marina',
  business_type: 'restaurant',
  business_subtype: 'cafe',
  slug: DEMO_SLUG,
  status: 'READY',
  notes: 'Modern minimal cafe along Dubai Marina. Marble counters, slow coffee, daytime culture. Refined but accessible. Day-focused, no nightlife angle.',
  template: 'restaurant-luxury',
  ambiance_lighting: 'cool_neutral',
  ambiance_surfaces: 'marble',
  ambiance_color_palette: 'cool_neutral',
  ambiance_mood: 'refined',
  ambiance_time_of_day: 'midday',
  palette_accent: '#B0552F',
  hero_tagline: 'Marina Daylight, Slow Coffee',
  hero_subtitle: 'A marble counter, a clear glass of water, an espresso poured dark against the morning.',
  story_paragraphs: JSON.stringify([
    'A place where mornings stretch longer. Where the first sip is never rushed.',
    'Marble surfaces catch the light from floor-to-ceiling windows overlooking the marina. The menu is short, deliberate — each item chosen, not filled.',
  ]),
  menu_items: JSON.stringify([
    { name: 'Espresso', desc: 'Single origin, dark roast', price: 'AED 22' },
    { name: 'Flat White', desc: 'Double shot, oat milk available', price: 'AED 28' },
    { name: 'Cold Brew', desc: '18-hour steep, served over ice', price: 'AED 32' },
    { name: 'Avocado Toast', desc: 'Sourdough, chili flakes, poached egg', price: 'AED 48' },
    { name: 'Granola Bowl', desc: 'Greek yogurt, seasonal fruit, honey', price: 'AED 42' },
    { name: 'Croissant', desc: 'Butter, plain or almond', price: 'AED 24' },
  ]),
  info_address: 'Dubai Marina Walk\nTower 3, Ground Floor\nDubai, UAE',
  info_hours: 'Daily 7:00 AM – 4:00 PM',
  info_phone: '+971 4 555 0123',
  info_reservation_url: '#',
};

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Check if demo lead already exists
  const [rows] = await conn.execute(
    'SELECT id FROM leads WHERE slug = ?',
    [DEMO_SLUG],
  );

  if (Array.isArray(rows) && rows.length > 0) {
    console.log(`Demo lead already exists (id=${rows[0].id}), updating...`);
    await conn.execute(
      `UPDATE leads SET
        store_name = ?, area = ?, business_type = ?, business_subtype = ?,
        status = ?, notes = ?, template = ?,
        ambiance_lighting = ?, ambiance_surfaces = ?, ambiance_color_palette = ?,
        ambiance_mood = ?, ambiance_time_of_day = ?, palette_accent = ?,
        hero_tagline = ?, hero_subtitle = ?,
        story_paragraphs = ?, menu_items = ?,
        info_address = ?, info_hours = ?, info_phone = ?, info_reservation_url = ?
      WHERE slug = ?`,
      [
        demoLead.store_name, demoLead.area, demoLead.business_type, demoLead.business_subtype,
        demoLead.status, demoLead.notes, demoLead.template,
        demoLead.ambiance_lighting, demoLead.ambiance_surfaces, demoLead.ambiance_color_palette,
        demoLead.ambiance_mood, demoLead.ambiance_time_of_day, demoLead.palette_accent,
        demoLead.hero_tagline, demoLead.hero_subtitle,
        demoLead.story_paragraphs, demoLead.menu_items,
        demoLead.info_address, demoLead.info_hours, demoLead.info_phone, demoLead.info_reservation_url,
        DEMO_SLUG,
      ],
    );
    console.log('Updated.');
  } else {
    await conn.execute(
      `INSERT INTO leads (
        store_name, area, business_type, business_subtype, slug, status,
        notes, template,
        ambiance_lighting, ambiance_surfaces, ambiance_color_palette,
        ambiance_mood, ambiance_time_of_day, palette_accent,
        hero_tagline, hero_subtitle,
        story_paragraphs, menu_items,
        info_address, info_hours, info_phone, info_reservation_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        demoLead.store_name, demoLead.area, demoLead.business_type, demoLead.business_subtype,
        demoLead.slug, demoLead.status,
        demoLead.notes, demoLead.template,
        demoLead.ambiance_lighting, demoLead.ambiance_surfaces, demoLead.ambiance_color_palette,
        demoLead.ambiance_mood, demoLead.ambiance_time_of_day, demoLead.palette_accent,
        demoLead.hero_tagline, demoLead.hero_subtitle,
        demoLead.story_paragraphs, demoLead.menu_items,
        demoLead.info_address, demoLead.info_hours, demoLead.info_phone, demoLead.info_reservation_url,
      ],
    );
    console.log('Inserted demo lead.');
  }

  await conn.end();
  console.log('Done. Demo page available at /r/la-letizia-dubai-marina');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
