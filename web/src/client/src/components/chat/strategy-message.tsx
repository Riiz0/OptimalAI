'use client';
import type { Strategy } from '../../../../types/strategy';
import { StrategyLogo } from '../base/strategy-logo';
import { ChatMessageTextContainer } from './chat-message-text-container';
import { ChatSubMessageContainer } from './chat-sub-message-container';

interface StrategyMessageProps {
  strategy: Strategy;
}

export const StrategyMessage = ({ strategy }: StrategyMessageProps) => {
  return (
    <ChatSubMessageContainer>
      <ChatMessageTextContainer>
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <StrategyLogo className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium text-white">Recommended Strategy</h3>
                <span className="text-sm text-text-secondary">
                  Risk Level: {strategy.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Allocations */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Lending Allocation</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${strategy.allocations.lending}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white">
                  {strategy.allocations.lending}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Liquidity Allocation</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${strategy.allocations.liquidity}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white">
                  {strategy.allocations.liquidity}%
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary">{strategy.description}</p>
        </div>
      </ChatMessageTextContainer>
    </ChatSubMessageContainer>
  );
};
