/**
 * Run the video generation pipeline for the La Letizia demo lead.
 * Execute with: npx tsx scripts/run-pipeline-demo.ts
 */

import { eq } from 'drizzle-orm';
import { getDb } from '../server/db';
import { leads } from '../drizzle/schema';
import { runPipeline } from '../server/pipeline/index';

async function main() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.slug, 'la-letizia-dubai-marina'))
    .limit(1);

  if (!lead) {
    console.error('Demo lead not found. Seed first.');
    process.exit(1);
  }

  console.log(`Found lead: id=${lead.id}, slug=${lead.slug}, status=${lead.status}`);
  console.log('Starting pipeline...');

  await runPipeline(lead.id);

  // Verify
  const [updated] = await db
    .select()
    .from(leads)
    .where(eq(leads.id, lead.id))
    .limit(1);

  console.log(`Pipeline complete. Status: ${updated?.status}`);
  console.log(`Frame count: ${updated?.frameCountLandscape}`);
  console.log(`Frame URLs (first 3): ${updated?.frameUrlsLandscape?.slice(0, 3).join(', ')}`);

  process.exit(0);
}

main().catch((err) => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
