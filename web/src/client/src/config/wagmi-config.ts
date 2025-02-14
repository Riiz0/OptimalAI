import { http, createConfig } from 'wagmi';
import { arbitrumSepolia, avalancheFuji, baseSepolia } from 'wagmi/chains';

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const wagmiConfig = createConfig({
  chains: [baseSepolia, avalancheFuji, arbitrumSepolia],
  transports: {
    [baseSepolia.id]: http(
      `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
    [avalancheFuji.id]: http(
      `https://avalanche-fuji.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
    [arbitrumSepolia.id]: http(
      `https://arbitrum-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
  },
  ssr: true,
});
