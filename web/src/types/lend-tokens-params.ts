import type { SupportedChain } from '@elizaos/plugin-evm';
import type { Address } from 'viem';

export interface LendTokensParams {
  protocol: 'aave' | 'compound';
  token: Address;
  amount: string;
  chain: SupportedChain;
}
