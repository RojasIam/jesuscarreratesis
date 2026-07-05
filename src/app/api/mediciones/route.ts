import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formDataToDbRow, type MedicionPayload } from '@/lib/database';
import { canCreateMedicion } from '@/lib/roles';

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mesParam = searchParams.get('mes');
  const anioParam = searchParams.get('anio');

  let query = supabase
    .from('mediciones')
    .select(`
      *,
      profiles:user_id (
        email,
        full_name,
        role
      )
    `)
    .order('created_at', { ascending: false });

  if (mesParam && anioParam) {
    const mes = Number(mesParam);
    const anio = Number(anioParam);
    if (mes >= 1 && mes <= 12 && anio >= 2000) {
      const start = new Date(anio, mes - 1, 1).toISOString();
      const end = new Date(anio, mes, 1).toISOString();
      query = query.gte('created_at', start).lt('created_at', end);
    }
  } else {
    query = query.limit(50);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ mediciones: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!canCreateMedicion(profile?.role)) {
    return NextResponse.json(
      { error: 'Tu rol no tiene permiso para registrar mediciones' },
      { status: 403 },
    );
  }

  let body: MedicionPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { formData } = body;
  const requiredFields: (keyof typeof formData)[] = [
    'departamento',
    'distrito',
    'sede',
    'tecnicoResponsable',
    'codigoCircuito',
    'clienteEmpresa',
    'tipoBanda',
    'potenciaSiteNodo',
    'numeroEmpalmes',
    'numeroConectores',
    'distanciaEnlace',
    'potenciaRecibidaRoseta',
    'peorEmpalme',
    'peorConector',
    'reflectancia',
  ];

  const missing = requiredFields.filter((field) => formData[field] === '' || formData[field] === null);
  if (missing.length > 0) {
    return NextResponse.json({ error: 'Complete todos los campos obligatorios' }, { status: 400 });
  }

  const row = formDataToDbRow(user.id, body);

  const { data, error } = await supabase.from('mediciones').insert(row).select().single();

  if (error) {
    if (error.code === '42P01') {
      return NextResponse.json(
        {
          error:
            'La tabla mediciones no existe. Ejecuta supabase/schema.sql en el SQL Editor de Supabase.',
        },
        { status: 503 },
      );
    }
    if (error.code === '42703') {
      return NextResponse.json(
        {
          error:
            'Faltan columnas de evidencias en mediciones. Ejecuta supabase/migrations/20250705000000_mediciones_evidencias.sql en Supabase.',
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ medicion: data }, { status: 201 });
}
