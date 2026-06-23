'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { canCreateMedicion } from '@/lib/roles';

export function TecnicoGuard({ children }: { children: React.ReactNode }) {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role && !canCreateMedicion(role)) {
      router.replace('/');
    }
  }, [role, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (role && !canCreateMedicion(role)) return null;

  return <>{children}</>;
}
