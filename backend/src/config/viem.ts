import { http, createPublicClient } from 'viem';
import { base, baseSepolia } from 'viem/chains';

export const VIEM_CONFIG = {
  chain: baseSepolia,
  transport: http(process.env.BASE_RPC_URL),
};

export const publicClient = createPublicClient(VIEM_CONFIG);

export const VIEM_MAINNET_CONFIG = {
  chain: base,
  transport: http(process.env.MAINNET_BASE_RPC_URL),
};

export const mainnetPublicClient = createPublicClient(VIEM_MAINNET_CONFIG);
