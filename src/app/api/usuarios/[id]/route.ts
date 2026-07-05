import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { adminUnauthorized, getAdminContext } from '@/lib/api-admin-auth';
import {
  buildFullName,
  validateUpdateUserPayload,
  type UpdateUserPayload,
} from '@/lib/users';

type RouteParams = { params: Promise<{ id: string }> };

async function countAdmins(adminClient: ReturnType<typeof createAdminClient>) {
  const { count, error } = await adminClient
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'admin');
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const ctx = await getAdminContext();
  if (!ctx) return adminUnauthorized();

  const { id } = await params;

  let body: UpdateUserPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const validationError = validateUpdateUserPayload(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: existing, error: fetchError } = await admin
    .from('profiles')
    .select('id, email, role')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  const nombres = body.nombres.trim();
  const apellidos = body.apellidos.trim();
  const phone = body.phone.trim();
  const email = body.email.trim().toLowerCase();
  const full_name = buildFullName(nombres, apellidos);
  const newPassword = body.password?.trim();

  if (newPassword && newPassword.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
  }

  if (existing.role === 'admin' && body.role !== 'admin') {
    const adminCount = await countAdmins(admin);
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: 'No puede quitar el rol de administrador al único admin del sistema' },
        { status: 400 },
      );
    }
  }

  if (email !== existing.email.toLowerCase()) {
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const emailTaken = existingUsers?.users?.some(
      (u) => u.id !== id && u.email?.toLowerCase() === email,
    );
    if (emailTaken) {
      return NextResponse.json({ error: 'Ya existe un usuario con ese correo' }, { status: 409 });
    }
  }

  const authUpdate: {
    email?: string;
    password?: string;
    user_metadata: Record<string, string>;
  } = {
    user_metadata: {
      full_name,
      nombres,
      apellidos,
      phone,
      role: body.role,
    },
  };

  if (email !== existing.email.toLowerCase()) {
    authUpdate.email = email;
  }
  if (newPassword) {
    authUpdate.password = newPassword;
  }

  const { error: authError } = await admin.auth.admin.updateUserById(id, authUpdate);
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .update({
      email,
      full_name,
      nombres,
      apellidos,
      phone,
      role: body.role,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, email, full_name, nombres, apellidos, phone, role, created_at, updated_at')
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ usuario: profile });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const ctx = await getAdminContext();
  if (!ctx) return adminUnauthorized();

  const { id } = await params;

  if (id === ctx.adminId) {
    return NextResponse.json({ error: 'No puede eliminar su propia cuenta' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: existing, error: fetchError } = await admin
    .from('profiles')
    .select('id, role')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  if (existing.role === 'admin') {
    const adminCount = await countAdmins(admin);
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: 'No puede eliminar al único administrador del sistema' },
        { status: 400 },
      );
    }
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
