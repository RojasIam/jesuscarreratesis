'use client';

import BrandCarouselImages from '@/components/BrandCarouselImages';

export default function SidebarWidget() {
  return (
    <div className="pb-8 pt-2">
      <BrandCarouselImages
        className="aspect-[4/5] w-full rounded-lg"
        innerClassName="p-2"
        imageSizes="208px"
      />
    </div>
  );
}
