/**
 * Crea usuarios de prueba en Supabase Auth y asigna roles.
 * Uso: npm run seed:test-users
 *
 * Credenciales test (misma contraseña para los tres):
 *   admin@test.com    → admin
 *   tecnico@test.com  → tecnico
 *   ti@test.com       → ti
 *   Contraseña: OpticalTest2025!
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const TEST_PASSWORD = 'OpticalTest2025!';

const TEST_USERS = [
  { email: 'admin@test.com', role: 'admin', full_name: 'Admin Test' },
  { email: 'tecnico@test.com', role: 'tecnico', full_name: 'Técnico Test' },
  { email: 'ti@test.com', role: 'ti', full_name: 'TI Test' },
];

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) {
    console.error('No se encontró .env.local');
    process.exit(1);
  }
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('\n🔐 Usuarios test — contraseña para todos:', TEST_PASSWORD, '\n');

  for (const user of TEST_USERS) {
    const { data: existing } = await supabase.auth.admin.listUsers();
    const found = existing?.users?.find((u) => u.email === user.email);

    let userId;

    if (found) {
      userId = found.id;
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: user.full_name },
      });
      if (error) {
        console.error(`✗ ${user.email}: ${error.message}`);
        continue;
      }
      console.log(`↻ Actualizado: ${user.email}`);
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: user.full_name },
      });
      if (error || !data.user) {
        console.error(`✗ ${user.email}: ${error?.message ?? 'Error desconocido'}`);
        continue;
      }
      userId = data.user.id;
      console.log(`✓ Creado: ${user.email}`);
    }

    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: userId,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );

    if (profileError) {
      console.error(`  ⚠ Perfil ${user.email}: ${profileError.message}`);
      console.error('    → Ejecuta supabase/schema.sql si la tabla profiles no existe.');
    } else {
      console.log(`  Rol: ${user.role}`);
    }
  }

  console.log('\nListo. Inicia sesión en http://localhost:3000/login\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
