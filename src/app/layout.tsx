import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { BRAND_FAVICON, BRAND_THEME_COLOR } from '@/config/brand';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Optical Quality',
  description: 'Medición y reportes de calidad óptica',
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: BRAND_FAVICON, type: 'image/png' }],
    apple: [{ url: BRAND_FAVICON, type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Optical Quality',
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_THEME_COLOR,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={outfit.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
