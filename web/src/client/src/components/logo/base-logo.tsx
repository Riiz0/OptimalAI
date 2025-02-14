import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function BaseLogo({ width = 24, height = 24, className }: LogoProps) {
  return (
    <Image
      src="/base-logo.png"
      alt="Base Logo"
      width={width}
      height={height}
      className={className}
    />
  );
}
