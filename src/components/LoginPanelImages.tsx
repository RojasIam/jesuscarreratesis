import BrandCarouselImages from '@/components/BrandCarouselImages';

type LoginPanelImagesProps = {
  className?: string;
};

export default function LoginPanelImages({ className = '' }: LoginPanelImagesProps) {
  return (
    <BrandCarouselImages
      className={className}
      innerClassName="p-6 sm:p-8 lg:p-10"
      imageSizes="(max-width: 1024px) 100vw, 480px"
    />
  );
}
