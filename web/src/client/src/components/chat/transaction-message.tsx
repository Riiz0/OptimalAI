'use client';

import { AaveLogo } from '@/components/base/aave-logo';
import { AerodromeLogo } from '@/components/base/aerodrome-logo';
import { CompoundLogo } from '@/components/base/compound-logo';
import { ChatMessageTextContainer } from '@/components/chat/chat-message-text-container';
import { ChatSubMessageContainer } from '@/components/chat/chat-sub-message-container';
import { logoForTokenName } from '@/lib/logo-for-token-name';
import { TrendingUp } from 'lucide-react';

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mr-20">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              {protocolToLogo[protocol]}
              {logoForTokenName(token)}
              {pairToken && logoForTokenName(pairToken)}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-white">
                {type === 'lending' ? 'Lending' : 'Adding Liquidity'}: {amount}{' '}
                {token}
                {pairToken && ` - ${pairToken}`}
              </span>
              <span className="text-sm text-text-secondary capitalize">
                {protocol}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-lg font-medium text-green-500">
                {typeof apy === 'number' ? `${apy.toFixed(2)}% APY` : 'N/A'}
              </span>
            </div>
            <a
              href={getExplorerUrl(chainId, txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-secondary hover:text-white transition-colors"
            >
              View Transaction ↗
            </a>
          </div>
        </div>
      </ChatMessageTextContainer>
    </ChatSubMessageContainer>
  );
};
