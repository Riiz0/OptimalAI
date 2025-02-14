'use client';

import { AaveLogo } from '@/components/base/aave-logo';
import { AerodromeLogo } from '@/components/base/aerodrome-logo';
import { CompoundLogo } from '@/components/base/compound-logo';
import { ChatMessageTextContainer } from '@/components/chat/chat-message-text-container';
import { ChatSubMessageContainer } from '@/components/chat/chat-sub-message-container';
import { logoForTokenName } from '@/lib/logo-for-token-name';
import { cn } from '@/lib/utils';
import { ExternalLink, TrendingUp } from 'lucide-react';

type Protocol = 'aave' | 'compound' | 'aerodrome';
type TransactionType = 'lending' | 'liquidity';

interface TransactionMessageProps {
  type: TransactionType;
  protocol: Protocol;
  token: string;
  pairToken?: string;
  amount: string;
  apy: number;
  txHash: string;
  chainId: number;
}

const protocolToLogo: Record<Protocol, React.ReactNode> = {
  aave: <AaveLogo className="h-6 w-6" />,
  compound: <CompoundLogo className="h-6 w-6" />,
  aerodrome: <AerodromeLogo className="h-6 w-6" />,
};

const getExplorerUrl = (chainId: number, txHash: string) => {
  const baseUrls: Record<number, string> = {
    8453: 'https://basescan.org',
    84532: 'https://sepolia.basescan.org',
  };
  return `${baseUrls[chainId]}/tx/${txHash}`;
};

export const TransactionMessage = ({
  type,
  protocol,
  token,
  pairToken,
  amount,
  apy,
  txHash,
  chainId,
}: TransactionMessageProps) => {
  return (
    <ChatSubMessageContainer>
      <ChatMessageTextContainer>
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                {protocolToLogo[protocol]}
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium text-white">
                  {type === 'lending'
                    ? 'Lending Position'
                    : 'Liquidity Position'}
                </h3>
                <span className="text-sm text-text-secondary capitalize">
                  {protocol}
                </span>
              </div>
            </div>
            <a
              href={getExplorerUrl(chainId, txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md bg-background px-2 py-1 text-xs text-text-secondary transition-colors hover:text-white"
            >
              View Transaction
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {logoForTokenName(token)}
                  {pairToken && logoForTokenName(pairToken)}
                </div>
                <span className="font-medium text-white">
                  {token}
                  {pairToken && ` / ${pairToken}`}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <span>Amount:</span>
                <span className="font-medium text-white">{amount}</span>
              </div>
            </div>

            {/* Right Column */}
            <div
              className={cn(
                'flex flex-col items-end gap-2',
                'rounded-lg bg-background p-2',
              )}
            >
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-lg font-medium text-green-500">
                  {apy.toFixed(2)}% APY
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                {type === 'lending'
                  ? 'Lending Interest Rate'
                  : 'Estimated Pool Yield'}
              </span>
            </div>
          </div>
        </div>
      </ChatMessageTextContainer>
    </ChatSubMessageContainer>
  );
};
