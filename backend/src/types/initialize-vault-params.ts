import type { Address, Chain } from 'viem';
import type { Strategy } from './strategy';

export interface InitializeVaultParams {
  userAddress: Address;
  chain: Chain;
  strategy: Strategy;
}
