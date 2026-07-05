import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canManageUsers } from '@/lib/roles';

export async function getAdminContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!canManageUsers(profile?.role)) return null;

  return { supabase, adminId: user.id };
}

export function adminUnauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
}
