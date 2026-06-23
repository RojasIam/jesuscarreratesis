export async function parseApiResponse<T extends { error?: string }>(
  response: Response,
  fallback: string,
): Promise<T> {
  const text = await response.text();

  if (!text) {
    return { error: fallback } as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text.length > 180 ? `${text.slice(0, 180)}…` : text || fallback);
  }
}
