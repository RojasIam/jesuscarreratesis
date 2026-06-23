import Image from 'next/image';
import { BRAND_LOGO, BRAND_NAME } from '@/config/brand';

type UserAvatarProps = {
  photoUrl?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeStyles = {
  sm: { box: 'h-9 w-9', image: 36, padding: 'p-1' },
  md: { box: 'h-11 w-11', image: 44, padding: 'p-1.5' },
  lg: { box: 'h-20 w-20', image: 80, padding: 'p-2' },
} as const;

export default function UserAvatar({
  photoUrl,
  alt,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  const hasPhoto = Boolean(photoUrl?.trim());
  const src = hasPhoto ? photoUrl!.trim() : BRAND_LOGO;
  const { box, image, padding } = sizeStyles[size];

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white dark:bg-gray-900 ${box} ${className}`}
    >
      <Image
        src={src}
        alt={alt ?? BRAND_NAME}
        width={image}
        height={image}
        className={`h-full w-full ${hasPhoto ? 'object-cover' : `object-contain ${padding}`}`}
      />
    </span>
  );
}
