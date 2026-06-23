import MedicionPageContent from '@/components/MedicionPageContent';
import { TecnicoGuard } from '@/components/TecnicoGuard';

export default function MedicionPage() {
  return (
    <TecnicoGuard>
      <MedicionPageContent />
    </TecnicoGuard>
  );
}
