import { http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { createConfig } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
  connectors: [
    coinbaseWallet({
      appName: 'Cento AI',
    }),
  ],
  ssr: true,
});
