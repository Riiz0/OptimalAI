import type { Address } from 'viem';
import type { Strategy } from './strategy';

export interface UserState {
  walletAddress?: Address;
  chainName?: string;
  vaultAddress?: Address;
  strategy?: Strategy;
}
