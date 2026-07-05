import MedicionDetalleContent from '@/components/MedicionDetalleContent';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MedicionDetallePage({ params }: PageProps) {
  const { id } = await params;
  return <MedicionDetalleContent id={id} />;
}
