import MedicionesTabla from '@/components/MedicionesTabla';
import { AdminGuard } from '@/components/AdminGuard';

export default function MedicionesPage() {
  return (
    <AdminGuard>
      <MedicionesTabla variant="full" showNewButton={false} />
    </AdminGuard>
  );
}
