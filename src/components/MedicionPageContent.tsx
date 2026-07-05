'use client';

import { useState } from 'react';
import FormularioMedicion from '@/components/FormularioMedicion';
import MedicionesTabla from '@/components/MedicionesTabla';
import { Modal } from '@/components/ui/modal/Modal';

export default function MedicionPageContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formSession, setFormSession] = useState(0);

  const handleSaved = () => {
    setRefreshKey((key) => key + 1);
    setModalOpen(false);
  };

  const openForm = () => {
    setFormSession((session) => session + 1);
    setModalOpen(true);
  };

  return (
    <div className="min-w-0 w-full">
      <MedicionesTabla
        refreshKey={refreshKey}
        variant="full"
        showNewButton
        onNewMedicionClick={openForm}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="max-h-[min(90vh,900px)] overflow-y-auto px-5 pt-6 pb-6 sm:px-8">
          <div className="mb-6 pr-10">
            <h2 className="text-lg font-semibold text-gray-800">Nueva medición</h2>
            <p className="mt-1 text-sm text-gray-500">
              Complete los datos para calcular IL_MAX y evaluar conformidad
            </p>
          </div>
          <FormularioMedicion key={formSession} embedded onSaved={handleSaved} />
        </div>
      </Modal>
    </div>
  );
}
