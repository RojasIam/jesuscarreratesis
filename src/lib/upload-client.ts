export async function uploadFile(
  file: File,
  folder = 'optical-quality/mediciones'
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? 'Error al subir archivo');
  }

  return { url: json.url, publicId: json.publicId };
}
