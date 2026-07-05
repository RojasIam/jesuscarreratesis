import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { adminUnauthorized, getAdminContext } from '@/lib/api-admin-auth';
import {
  buildFullName,
  validateCreateUserPayload,
  type CreateUserPayload,
} from '@/lib/users';

export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return adminUnauthorized();

  const { data, error } = await ctx.supabase
    .from('profiles')
    .select('id, email, full_name, nombres, apellidos, phone, role, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ usuarios: data });
}

export async function POST(request: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return adminUnauthorized();

  let body: CreateUserPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const validationError = validateCreateUserPayload(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const nombres = body.nombres.trim();
  const apellidos = body.apellidos.trim();
  const phone = body.phone.trim();
  const email = body.email.trim().toLowerCase();
  const full_name = buildFullName(nombres, apellidos);

  const admin = createAdminClient();

  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const emailTaken = existingUsers?.users?.some(
    (u) => u.email?.toLowerCase() === email,
  );
  if (emailTaken) {
    return NextResponse.json({ error: 'Ya existe un usuario con ese correo' }, { status: 409 });
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: body.password,
    email_confirm: true,
    user_metadata: {
      full_name,
      nombres,
      apellidos,
      phone,
      role: body.role,
    },
  });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message ?? 'No se pudo crear el usuario' },
      { status: 500 },
    );
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .upsert(
      {
        id: created.user.id,
        email,
        full_name,
        nombres,
        apellidos,
        phone,
        role: body.role,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select('id, email, full_name, nombres, apellidos, phone, role, created_at, updated_at')
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ usuario: profile }, { status: 201 });
}
