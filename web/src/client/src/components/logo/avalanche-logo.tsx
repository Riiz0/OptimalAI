import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function AvalancheLogo({
  width = 24,
  height = 24,
  className,
}: LogoProps) {
  return (
    <Image
      src="/avalanche-logo.png"
      alt="Avalanche Logo"
      width={width}
      height={height}
      className={className}
    />
  );
}
