import Image from 'next/image';

export function logoForTokenName(token: string) {
  if (token === 'USDC') {
    return <Image src="/usdc.png" alt="USDC Logo" width={26} height={26} />;
  }
  return <Image src="/usdt.png" alt="USDT Logo" width={26} height={26} />;
}
