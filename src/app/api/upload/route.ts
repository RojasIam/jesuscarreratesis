import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folderRaw = formData.get('folder');
    const folder =
      typeof folderRaw === 'string' && folderRaw.startsWith('optical-quality/')
        ? folderRaw
        : 'optical-quality/mediciones';

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'El archivo no puede superar 10 MB' }, { status: 400 });
    }

    const { url, publicId } = await uploadToCloudinary(file, folder);
    return NextResponse.json({ url, publicId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al subir archivo';
    console.error('[api/upload]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
