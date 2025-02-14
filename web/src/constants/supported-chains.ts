import type { Chain } from 'viem';
import { arbitrumSepolia, avalancheFuji, baseSepolia } from 'viem/chains';

export interface SupportedChain {
  id: number;
  name: string;
  elizaName: string;
  chain: Chain;
  testnet: boolean;
}

export const SUPPORTED_CHAINS: readonly SupportedChain[] = [
  {
    id: baseSepolia.id,
    name: 'Base Sepolia',
    elizaName: 'baseSepolia',
    chain: baseSepolia,
    testnet: true,
  },
  {
    id: arbitrumSepolia.id,
    name: 'Arbitrum Sepolia',
    elizaName: 'arbitrumSepolia',
    chain: arbitrumSepolia,
    testnet: true,
  },
  {
    id: avalancheFuji.id,
    name: 'Avalanche Fuji',
    elizaName: 'avalancheFuji',
    chain: avalancheFuji,
    testnet: true,
  },
] as const;

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]['id'];
export type SupportedChainName = (typeof SUPPORTED_CHAINS)[number]['name'];
export const SUPPORTED_CHAINS_TYPES_STRING =
  "'baseSepolia' | 'arbitrumSepolia' | 'avalancheFuji' | 'opSepolia'";
