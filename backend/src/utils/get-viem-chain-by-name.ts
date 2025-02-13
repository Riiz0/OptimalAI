import * as viemChains from 'viem/chains';
import type { Chain } from 'viem/chains';

export function getViemChainByName(chainName: string): Chain {
  return viemChains[chainName];
}
