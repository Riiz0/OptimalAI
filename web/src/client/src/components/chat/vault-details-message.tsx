'use client';

import { logoForTokenName } from '@/lib/logo-for-token-name';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import type { Strategy } from '../../../../types/strategy';
import { BalancesLogo } from '../base/balances-logo';
import { StrategyLogo } from '../base/strategy-logo';
import { PrimaryButton } from '../ui/primary-button';
import { ChatMessageTextContainer } from './chat-message-text-container';
import { ChatSubMessageContainer } from './chat-sub-message-container';

interface VaultDetailsMessageProps {
  address: string;
  isActive: boolean;
  createdAt: string;
  lastUpdate: string;
  balances: {
    token: string;
    amount: string;
    symbol: string;
  }[];
  strategy: Strategy;
  onFund?: () => void;
}

export const VaultDetailsMessage = ({
  address,
  isActive,
  createdAt,
  lastUpdate,
  balances,
  strategy,
  onFund,
}: VaultDetailsMessageProps) => {
  return (
    <ChatSubMessageContainer>
      <ChatMessageTextContainer>
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-56">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-white">
                Vault: {address.slice(0, 6)}...{address.slice(-4)}
              </h2>
              <button className="text-text-secondary hover:text-white">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  isActive ? 'bg-green-500' : 'bg-red-500',
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  isActive ? 'text-green-500' : 'text-red-500',
                )}
              >
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-col gap-1 border-b border-white/10 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">Created:</p>
              <p className="text-white">{createdAt}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">Last update:</p>
              <p className="text-white">{lastUpdate}</p>
            </div>
          </div>

          {/* Balances */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-white">Balances</h3>
              <div className="rounded-md bg-[#19202C] p-0.5">
                <BalancesLogo width={20} height={20} />
              </div>
            </div>
            <div className="flex flex-col gap-1 border-b border-white/10 pb-3">
              {balances.map(({ token, amount }) => (
                <div key={token} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {logoForTokenName(token)}
                    <span className="text-text-secondary">{token}</span>
                  </div>
                  <span className="text-white">{amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-white">Strategy</h3>
              <div className="rounded-md bg-[#19202C] p-0.5">
                <StrategyLogo width={20} height={20} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Risk Level</span>
                <span className="text-white">
                  {strategy.riskLevel.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Lending Allocation</span>
                <span className="text-white">
                  {strategy.allocations.lending}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">
                  Liquidity Allocation
                </span>
                <span className="text-white">
                  {strategy.allocations.liquidity}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-2 flex justify-end">
            <PrimaryButton onClick={onFund} className="w-full">
              Fund Vault
            </PrimaryButton>
          </div>
        </div>
      </ChatMessageTextContainer>
    </ChatSubMessageContainer>
  );
};
