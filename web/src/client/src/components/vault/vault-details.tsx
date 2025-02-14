import { logoForTokenName } from '@/lib/logo-for-token-name';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import type { Strategy } from '../../../../types/strategy';
import { BalancesLogo } from '../base/balances-logo';
import { StrategyLogo } from '../base/strategy-logo';
import { PrimaryButton } from '../ui/primary-button';

interface VaultDetailsProps {
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
}

export const VaultDetails = ({
  address,
  isActive,
  createdAt,
  lastUpdate,
  balances,
  strategy,
}: VaultDetailsProps) => {
  return (
    <div className="flex h-full flex-col rounded-lg bg-[#1A212D] p-6">
      {/* Content wrapper */}
      <div className="flex flex-1 flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium text-white">
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
        <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
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
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl text-white">Balances</h3>
            <div className="p-0.5 bg-[#19202C] rounded-md">
              <BalancesLogo width={20} height={20} />
            </div>
          </div>
          <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
            {balances.map(({ token, amount }) => (
              <div key={token} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {logoForTokenName(token)}
                  <span className="text-text-secondary">{token}</span>
                </div>
                <span className="text-white">{amount} </span>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl text-white">Strategy</h3>
            <div className="p-0.5 bg-[#19202C] rounded-md">
              <StrategyLogo width={20} height={20} />
            </div>
          </div>
          <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
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
              <span className="text-text-secondary">Liquidity Allocation</span>
              <span className="text-white">
                {strategy.allocations.liquidity}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions - Always at bottom */}
      <div className="mt-auto grid grid-cols-2 gap-4 pt-4">
        <button className="rounded-lg bg-background-secondary px-4 py-3 font-medium text-white transition-colors hover:bg-background-secondary/90">
          Withdraw
        </button>
        <PrimaryButton>Fund</PrimaryButton>
      </div>
    </div>
  );
};
