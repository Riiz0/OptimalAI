import type { Strategy } from './strategy';

export type MessageType =
  | 'user'
  | 'agent'
  | 'strategy'
  | 'transaction'
  | 'vault'
  | 'opportunity';
export type TransactionType = 'lending' | 'liquidity';
export type Protocol = 'aave' | 'compound' | 'aerodrome';

export interface Balance {
  token: string;
  amount: string;
  symbol: string;
}

export interface TransactionContent {
  type: TransactionType;
  protocol: Protocol;
  token: string;
  pairToken?: string;
  amount: string;
  apy: number;
  txHash: string;
  chainId: number;
}

export interface OpportunityContent {
  type: TransactionType;
  protocol: string;
  token: string;
  pairToken?: string;
  apy: number;
}

export interface VaultContent {
  address: string;
  isActive: boolean;
  createdAt: string;
  lastUpdate: string;
  balances: Balance[];
  strategy: Strategy;
}

export type Message =
  | { type: 'user' | 'agent'; content: string }
  | { type: 'strategy'; content: { strategy: Strategy } }
  | { type: 'transaction'; content: TransactionContent }
  | { type: 'vault'; content: VaultContent }
  | { type: 'opportunity'; content: OpportunityContent };
