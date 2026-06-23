import GridShape from '@/components/common/GridShape';
// import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo';
import BrandLogo from '@/components/common/BrandLogo';
import Link from 'next/link';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-1 bg-white p-6 dark:bg-gray-900 sm:p-0">
      <div className="relative flex h-screen w-full flex-col justify-center dark:bg-gray-900 sm:p-0 lg:flex-row">
        {children}
        <div className="hidden h-full w-full items-center bg-brand-950 lg:grid lg:w-1/2 dark:bg-white/5">
          <div className="relative z-1 flex items-center justify-center">
            <GridShape />
            <div className="flex max-w-xs flex-col items-center">
              <Link href="/" className="mb-4 block">
                <BrandLogo variant="auth" priority />
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                Medición y reportes de calidad óptica en campo
              </p>
            </div>
          </div>
        </div>
        {/* Tema oscuro deshabilitado por ahora */}
        {/* <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div> */}
      </div>
    </div>
  );
}
