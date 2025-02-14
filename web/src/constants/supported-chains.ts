import type { Chain } from 'viem';
import { arbitrumSepolia, avalancheFuji, baseSepolia } from 'viem/chains';

export interface SupportedChain {
  id: number;
  name: string;
  chain: Chain;
  testnet: boolean;
}

export const SUPPORTED_CHAINS: readonly SupportedChain[] = [
  {
    id: baseSepolia.id,
    name: 'Base Sepolia',
    chain: baseSepolia,
    testnet: true,
  },
  {
    id: arbitrumSepolia.id,
    name: 'Arbitrum Sepolia',
    chain: arbitrumSepolia,
    testnet: true,
  },
  {
    id: avalancheFuji.id,
    name: 'Avalanche Fuji',
    chain: avalancheFuji,
    testnet: true,
  },
] as const;

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]['id'];
export type SupportedChainName = (typeof SUPPORTED_CHAINS)[number]['name'];
