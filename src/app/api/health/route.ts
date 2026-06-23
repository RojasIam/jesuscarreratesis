import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const checks = {
    supabase: false,
    cloudinary: false,
  };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('mediciones').select('id').limit(1);
    checks.supabase = !error || error.code !== 'PGRST116';
    if (error?.code === '42P01') checks.supabase = false;
    else if (!error) checks.supabase = true;
  } catch {
    checks.supabase = false;
  }

  checks.cloudinary = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

  const ok = checks.supabase && checks.cloudinary;

  return NextResponse.json(
    {
      ok,
      services: checks,
      message: ok
        ? 'Supabase y Cloudinary configurados'
        : 'Revisa configuración o ejecuta supabase/schema.sql',
    },
    { status: ok ? 200 : 503 },
  );
}
