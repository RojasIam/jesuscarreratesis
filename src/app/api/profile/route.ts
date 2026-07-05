import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { translateUserMessage } from '@/lib/user-messages';

export const runtime = 'nodejs';

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let body: {
      full_name?: string;
      avatar_url?: string | null;
      avatar_public_id?: string | null;
      password?: string;
      password_confirm?: string;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
    }

    const password = body.password?.trim() ?? '';
    const passwordConfirm = body.password_confirm?.trim() ?? '';

    if (password || passwordConfirm) {
      if (!password) {
        return NextResponse.json({ error: 'Ingresa la nueva contraseña' }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'La contraseña debe tener al menos 6 caracteres' },
          { status: 400 },
        );
      }
      if (password !== passwordConfirm) {
        return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 });
      }

      const { error: passwordError } = await supabase.auth.updateUser({ password });

    if (passwordError) {
      return NextResponse.json(
        { error: translateUserMessage(passwordError.message, 'No se pudo actualizar la contraseña') },
        { status: 400 },
      );
    }
    }

    const updates: Record<string, string | null> = {
      updated_at: new Date().toISOString(),
    };

    if (body.full_name !== undefined) {
      const name = body.full_name.trim();
      if (!name) {
        return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
      }
      updates.full_name = name;
    }

    if (body.avatar_url !== undefined) {
      updates.avatar_url = body.avatar_url;
    }

    if (body.avatar_public_id !== undefined) {
      updates.avatar_public_id = body.avatar_public_id;
    }

    const hasProfileFieldUpdates =
      body.full_name !== undefined ||
      body.avatar_url !== undefined ||
      body.avatar_public_id !== undefined;

    if (!hasProfileFieldUpdates && !password) {
      return NextResponse.json({ error: 'No hay cambios para guardar' }, { status: 400 });
    }

    if (!hasProfileFieldUpdates) {
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
      }

      return NextResponse.json({ profile: currentProfile });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('*')
      .single();

    if (error) {
      if (error.message.includes('avatar_url') || error.message.includes('avatar_public_id')) {
        return NextResponse.json(
          {
            error:
              'Faltan columnas de avatar en Supabase. Ejecuta: alter table public.profiles add column if not exists avatar_url text; alter table public.profiles add column if not exists avatar_public_id text;',
          },
          { status: 500 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al guardar el perfil';
    console.error('[api/profile]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
