import React from 'react';

export default function SidebarWidget() {
  return (
    <div className="pb-20">
      <div className="mx-auto rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]">
        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Optical Quality</h3>
        <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
          Medición y reportes de calidad óptica en campo con evaluación automática de conformidad.
        </p>
        <a
          href="/formulas"
          className="flex items-center justify-center rounded-lg bg-brand-500 p-3 font-medium text-white text-theme-sm hover:bg-brand-600"
        >
          Ver fórmulas
        </a>
      </div>
    </div>
  );
}
