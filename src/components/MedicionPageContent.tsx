'use client';

import { useState } from 'react';
import { PlusIcon } from '@/icons';
import FormularioMedicion from '@/components/FormularioMedicion';
import MedicionesTabla from '@/components/MedicionesTabla';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal/Modal';

export default function MedicionPageContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setRefreshKey((key) => key + 1);
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-semibold text-gray-800 text-title-sm sm:text-title-md">Mediciones</h1>
        <p className="mt-1 text-sm text-gray-500">
          Registra nuevos servicios y consulta el historial con resultados de conformidad
        </p>
      </div>

      <div className="flex justify-center">
        <Button
          size="md"
          onClick={() => setModalOpen(true)}
          startIcon={<PlusIcon className="size-5" />}
        >
          Nueva medición
        </Button>
      </div>

      <MedicionesTabla refreshKey={refreshKey} variant="full" showNewButton={false} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="max-h-[min(90vh,900px)] overflow-y-auto px-5 pt-6 pb-6 sm:px-8">
          <div className="mb-6 pr-10">
            <h2 className="text-lg font-semibold text-gray-800">Nueva medición</h2>
            <p className="mt-1 text-sm text-gray-500">
              Complete los datos para calcular IL_MAX y evaluar conformidad
            </p>
          </div>
          <FormularioMedicion embedded onSaved={handleSaved} />
        </div>
      </Modal>
    </div>
  );
}
