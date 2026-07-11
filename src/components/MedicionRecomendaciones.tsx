import {
  getMedicionRecomendaciones,
  type MedicionEstado,
} from '@/lib/calculations';

const toneClass: Record<MedicionEstado, string> = {
  Excelente: 'border-success-200 bg-success-50 text-success-800',
  Bueno: 'border-warning-200 bg-warning-50 text-warning-800',
  Regular: 'border-warning-300 bg-warning-50 text-warning-900',
  'No Conforme': 'border-error-200 bg-error-50 text-error-800',
};

type MedicionRecomendacionesProps = {
  estado: MedicionEstado | string | null | undefined;
};

export default function MedicionRecomendaciones({ estado }: MedicionRecomendacionesProps) {
  const items = getMedicionRecomendaciones(estado);
  if (!items.length || !estado || !(estado in toneClass)) return null;

  return (
    <div
      className={`rounded-lg border px-4 py-3 ${toneClass[estado as MedicionEstado]}`}
    >
      <p className="text-sm font-semibold">Recomendaciones</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
