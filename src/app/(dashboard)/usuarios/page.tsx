import UsuariosPageContent from '@/components/UsuariosPageContent';
import { AdminGuard } from '@/components/AdminGuard';

export default function UsuariosPage() {
  return (
    <AdminGuard>
      <UsuariosPageContent />
    </AdminGuard>
  );
}
