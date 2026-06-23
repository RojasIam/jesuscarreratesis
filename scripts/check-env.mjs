import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const envPath = resolve(process.cwd(), '.env.local');
if (!existsSync(envPath)) {
  console.error('❌ Falta .env.local');
  process.exit(1);
}

const env = {};
readFileSync(envPath, 'utf-8').split('\n').forEach((line) => {
  const t = line.trim();
  if (!t || t.startsWith('#')) return;
  const i = t.indexOf('=');
  if (i === -1) return;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
});

let ok = true;
for (const key of required) {
  if (env[key]) {
    console.log(`✓ ${key}`);
  } else {
    console.log(`✗ ${key} — FALTA`);
    ok = false;
  }
}

process.exit(ok ? 0 : 1);
