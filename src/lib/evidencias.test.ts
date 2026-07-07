import { describe, expect, it } from 'vitest';
import { getFotosOtdrUrls } from '@/lib/evidencias';

describe('evidencias', () => {
  it('prioriza el arreglo de fotos OTDR', () => {
    expect(
      getFotosOtdrUrls({
        foto_otdr_url: 'https://legacy.test/1.jpg',
        fotos_otdr_urls: ['https://new.test/1.jpg', 'https://new.test/2.jpg'],
      }),
    ).toEqual(['https://new.test/1.jpg', 'https://new.test/2.jpg']);
  });

  it('usa la foto OTDR legacy si no hay arreglo', () => {
    expect(
      getFotosOtdrUrls({
        foto_otdr_url: 'https://legacy.test/1.jpg',
        fotos_otdr_urls: null,
      }),
    ).toEqual(['https://legacy.test/1.jpg']);
  });
});
