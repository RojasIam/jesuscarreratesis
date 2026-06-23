import type { Metadata } from 'next';
import PerfilContent from '@/components/PerfilContent';

export const metadata: Metadata = {
  title: 'Mi perfil | Optical Quality',
};

export default function PerfilPage() {
  return <PerfilContent />;
}
