import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function ArbitrumLogo({
  width = 24,
  height = 24,
  className,
}: LogoProps) {
  return (
    <Image
      src="/arbitrum-logo.png"
      alt="Arbitrum Logo"
      width={width}
      height={height}
      className={className}
    />
  );
}
