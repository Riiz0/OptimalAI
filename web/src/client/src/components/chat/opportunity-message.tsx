'use client';

import { logoForTokenName } from '@/lib/logo-for-token-name';
import { ChatMessageTextContainer } from './chat-message-text-container';
import { ChatSubMessageContainer } from './chat-sub-message-container';

interface OpportunityMessageProps {
  type: 'lending' | 'liquidity';
  protocol: string;
  token: string;
  apy: number;
  pairToken?: string; // Optional for liquidity pools
}

export const OpportunityMessage = ({
  type,
  protocol,
  token,
  apy,
  pairToken,
}: OpportunityMessageProps) => {
  return (
    <ChatSubMessageContainer>
      <ChatMessageTextContainer>
        <h3 className="border-b border-white/10 pb-2 text-lg text-white">
          {type === 'lending'
            ? 'Yield Opportunities:'
            : 'Liquidity Pool Opportunities'}
        </h3>
        <div className="flex items-center justify-between pt-2 gap-56">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              {logoForTokenName(token)}
              {pairToken && logoForTokenName(pairToken)}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-white">
                {token}
                {pairToken && ` - ${pairToken}`}
              </span>
              <span className="text-sm text-text-secondary">{protocol}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-medium text-green-500">
              {apy.toFixed(1)}% APY
            </span>
          </div>
        </div>
      </ChatMessageTextContainer>
    </ChatSubMessageContainer>
  );
};
