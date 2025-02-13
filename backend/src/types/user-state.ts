import type { Address } from 'viem';
import type { Strategy } from '../services/strategy.service';

export interface UserState {
  walletAddress?: Address;
  vaultAddress?: Address;
  strategy?: Strategy;
}
