/**
 * Standalone pipeline runner for the demo lead.
 * Runs the Atlas Cloud video generation + ffmpeg frame extraction + S3 upload.
 *
 * Usage: node scripts/run-pipeline.mjs [leadId]
 * If no leadId provided, uses the la-letizia-dubai-marina slug to find it.
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Get env from running server process
function getEnvFromServer() {
  try {
    const pid = execSync('lsof -ti :3000', { encoding: 'utf8' }).trim().split('\n')[0];
    const env = readFileSync(`/proc/${pid}/environ`).toString();
    const vars = env.split('\0');
    for (const v of vars) {
      const eqIdx = v.indexOf('=');
      if (eqIdx > 0) {
        const key = v.slice(0, eqIdx);
        const val = v.slice(eqIdx + 1);
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch (e) {
    console.error('Could not read env from server process:', e.message);
  }
}

getEnvFromServer();

// Now dynamically import the pipeline
const { runPipeline } = await import('../server/pipeline/index.ts');

// Find lead ID
const leadId = process.argv[2] ? parseInt(process.argv[2], 10) : null;

if (leadId) {
  console.log(`Running pipeline for lead ID: ${leadId}`);
  await runPipeline(leadId);
  console.log('Pipeline complete.');
} else {
  // Find by slug
  const mysql = await import('mysql2/promise');
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const [rows] = await conn.execute('SELECT id FROM leads WHERE slug = ?', ['la-letizia-dubai-marina']);
  await conn.end();

  if (!Array.isArray(rows) || rows.length === 0) {
    console.error('Demo lead not found. Run seed first.');
    process.exit(1);
  }

  const id = rows[0].id;
  console.log(`Running pipeline for demo lead (id=${id})...`);
  await runPipeline(id);
  console.log('Pipeline complete.');
}
