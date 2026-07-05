import LoginPanelImages from '@/components/LoginPanelImages';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-100 via-white to-brand-50/40 p-4 sm:p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-theme-lg sm:rounded-2xl lg:grid-cols-[1fr_1.05fr] lg:min-h-[min(520px,88dvh)]">
        {/* Imagen arriba en móvil, derecha en desktop */}
        <LoginPanelImages className="relative order-1 h-44 border-t border-gray-100 sm:h-52 lg:order-2 lg:h-auto lg:min-h-[480px] lg:border-t-0 lg:border-l" />

        <div className="order-2 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-9 lg:order-1 lg:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
