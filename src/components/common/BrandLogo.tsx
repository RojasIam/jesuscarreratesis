import Image from 'next/image';
import { BRAND_LOGO, BRAND_NAME } from '@/config/brand';

type BrandLogoProps = {
  variant?: 'sidebar' | 'sidebar-collapsed' | 'header' | 'auth';
  className?: string;
  priority?: boolean;
};

const variants = {
  sidebar: {
    width: 112,
    height: 112,
    className: 'h-28 w-28 object-contain',
  },
  'sidebar-collapsed': {
    width: 64,
    height: 64,
    className: 'h-16 w-16 object-contain',
  },
  header: {
    width: 48,
    height: 48,
    className: 'h-12 w-12 object-contain',
  },
  auth: {
    width: 112,
    height: 112,
    className: 'h-28 w-28 object-contain',
  },
} as const;

export default function BrandLogo({
  variant = 'sidebar',
  className = '',
  priority = false,
}: BrandLogoProps) {
  const { width, height, className: sizeClass } = variants[variant];

  return (
    <Image
      src={BRAND_LOGO}
      alt={BRAND_NAME}
      width={width}
      height={height}
      priority={priority}
      className={`${sizeClass} ${className}`.trim()}
    />
  );
}
