import ComponentCard from '@/components/common/ComponentCard';

const colorLegend = [
  {
    title: 'Potencia Site-Nodo (dBm)',
    items: [
      { color: 'bg-success-100 border-success-500', label: 'Verde: x ≥ -7' },
      { color: 'bg-warning-100 border-warning-500', label: 'Amarillo: -9.5 ≤ x < -7' },
      { color: 'bg-error-100 border-error-500', label: 'Rojo: x < -9.5' },
    ],
  },
  {
    title: 'Peor empalme (dB)',
    items: [
      { color: 'bg-success-100 border-success-500', label: 'Verde: x < 0.8' },
      { color: 'bg-warning-100 border-warning-500', label: 'Amarillo: 0.8 ≤ x < 1' },
      { color: 'bg-error-100 border-error-500', label: 'Rojo: x ≥ 1' },
    ],
  },
  {
    title: 'Peor conector (dB)',
    items: [
      { color: 'bg-success-100 border-success-500', label: 'Verde: x < 1' },
      { color: 'bg-warning-100 border-warning-500', label: 'Amarillo: 1 ≤ x < 1.3' },
      { color: 'bg-error-100 border-error-500', label: 'Rojo: x ≥ 1.3' },
    ],
  },
  {
    title: 'Reflectancia (dB)',
    items: [
      { color: 'bg-success-100 border-success-500', label: 'Verde: x ≤ -40' },
      { color: 'bg-warning-100 border-warning-500', label: 'Amarillo: -40 < x ≤ -35' },
      { color: 'bg-error-100 border-error-500', label: 'Rojo: x > -35' },
    ],
  },
];

const evaluationItems = [
  { estado: 'Excelente', condition: 'IL_REAL ≤ 0.75 × IL_MAX', dot: 'bg-success-500' },
  { estado: 'Bueno', condition: 'IL_REAL ≤ 0.90 × IL_MAX', dot: 'bg-orange-500' },
  { estado: 'Regular', condition: 'IL_REAL ≤ IL_MAX', dot: 'bg-warning-500' },
  { estado: 'No Conforme', condition: 'IL_REAL > IL_MAX', dot: 'bg-error-500' },
];

export default function FormulasContent() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Fórmulas
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Criterios de cálculo y evaluación de conformidad
        </p>
      </div>

      <ComponentCard title="Fórmula principal: IL_MAX">
        <div className="rounded-xl border-l-4 border-brand-500 bg-gray-50 p-4 dark:bg-white/[0.03]">
          <p className="font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            IL_MAX = (L × α) + (Ne × Pe) + (Nc × Pc) + M
          </p>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            L = longitud del enlace (km), Ne = empalmes, Nc = conectores, M = margen (1 dB).
            α, Pe y Pc dependen del tipo de banda (1310, 1490 o 1550).
          </p>
        </div>
      </ComponentCard>

      <ComponentCard title="Pérdida óptica real: IL_REAL">
        <div className="rounded-xl border-l-4 border-brand-500 bg-gray-50 p-4 dark:bg-white/[0.03]">
          <p className="font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            IL_REAL = |Potencia TX − Potencia RX|
          </p>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Se usa valor absoluto porque las potencias en dBm suelen ser negativas; el resultado
            se expresa en dB (pérdida).
          </p>
        </div>
      </ComponentCard>

      <ComponentCard title="Evaluación del estado">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {evaluationItems.map((item) => (
            <div key={item.estado} className="flex items-center gap-4 py-3.5">
              <span className={`h-3 w-3 shrink-0 rounded-full ${item.dot}`} />
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90">{item.estado}</p>
                <p className="font-mono text-theme-xs text-gray-500 dark:text-gray-400">{item.condition}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Indicadores de color">
        <div className="space-y-4">
          {colorLegend.map((group) => (
            <div key={group.title} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <h3 className="mb-3 font-medium text-gray-800 dark:text-white/90">{group.title}</h3>
              {group.items.map((item) => (
                <div key={item.label} className="flex items-center gap-3 py-1.5">
                  <span className={`h-6 w-6 shrink-0 rounded-md border-2 ${item.color}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ComponentCard>
    </div>
  );
}
