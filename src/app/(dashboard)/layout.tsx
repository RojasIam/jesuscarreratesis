import { AuthGuard } from '@/components/AuthGuard';
import AdminLayout from '@/layout/AdminLayout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  );
}
