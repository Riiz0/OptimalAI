'use client';
import { cn } from '@/lib/utils';
import { messagesService } from '@/services/messages';
import { useState } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { SUPPORTED_CHAINS } from '../../../../constants/supported-chains';
import { ChatBox } from './chat-box';
import { ChatInfo } from './chat-info';
import { ChatMessagesContainer } from './chat-messages-container';
import { ChatStatusBar } from './chat-status-bar';

export const ChatContainer = () => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { isConnected, isConnecting, address, chain } = useAccount();

  const { isLoading: isInitializing } = useSWR(
    isExpanded && address && chain ? 'init-chat' : null,
    () =>
      messagesService.send({
        name: address ?? '',
        text: `Initialize user state {walletAddress: "${address}", chain: "${
          SUPPORTED_CHAINS.find((c) => c.id === chain?.id)?.elizaName ?? ''
        }"}`,
      }),
    {
      revalidateOnFocus: false,
    },
  );

  const status = isConnecting
    ? 'connecting'
    : isConnected
      ? isInitializing
        ? 'initializing'
        : 'connected'
      : 'disconnected';

  return (
    <div className="flex flex-col">
      {/* Status Bar */}
      <div
        className={cn(
          'transition-all duration-300 transform',
          isExpanded
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none',
        )}
      >
        <ChatStatusBar status={status} />
      </div>

      {/* Messages Container */}
      <ChatMessagesContainer isExpanded={isExpanded} />

      {/* Chat Input Area */}
      <div className="relative">
        {/* Background Info */}
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <ChatInfo isExpanded={isExpanded} />
        </div>

        {/* Chat Box with width transition wrapper */}
        <div className="flex justify-center">
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              isExpanded ? 'w-full' : 'w-[768px]',
            )}
          >
            <ChatBox
              message={message}
              setMessage={setMessage}
              disabled={!isConnected}
              onFocus={() => setIsExpanded(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
