'use client';
import { ChatBox } from '@/components/chat/chat-box';
import { ChatInfo } from '@/components/chat/chat-info';
import { ChatMessage } from '@/components/chat/chat-message';
import { ChatMessagesContainer } from '@/components/chat/chat-messages-container';
import { ChatStatusBar } from '@/components/chat/chat-status-bar';
import { OpportunityMessage } from '@/components/chat/opportunity-message';
import { StrategyMessage } from '@/components/chat/strategy-message';
import { TransactionMessage } from '@/components/chat/transaction-message';
import { VaultDetailsMessage } from '@/components/chat/vault-details-message';
import { processApiResponse } from '@/lib/message-processor';
import { cn } from '@/lib/utils';
import { messagesService } from '@/services/messages';
import { useDemoStore } from '@/stores/demo-store';
import type { Message } from '@/types/messages';
import { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

export const ChatContainer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, isConnecting, address, chain } = useAccount();
  const { isDemoMode } = useDemoStore();
  const hasInitialized = useRef(false);

  // Initialize conversation when expanded for the first time
  useEffect(() => {
    const initializeConversation = async () => {
      if (
        (isConnected || isDemoMode) &&
        isExpanded &&
        !hasInitialized.current &&
        messages.length === 0
      ) {
        hasInitialized.current = true;
        setIsLoading(true);
        try {
          const response = await messagesService.send({
            name: address ?? '',
            text: `initialize user {walletAddress: ${address}, chainId: ${chain?.id}}`,
          });
          const newMessages = processApiResponse(response);
          setMessages(newMessages);
        } catch (error) {
          console.error('Failed to initialize conversation:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeConversation();
  }, [
    isConnected,
    isDemoMode,
    address,
    messages.length,
    chain?.id,
    isExpanded,
  ]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = { type: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await messagesService.send({
        name: address ?? '',
        text,
      });

      // Process all messages from the response
      const newMessages = processApiResponse(response);
      setMessages((prev) => [...prev, ...newMessages]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: 'agent', content: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const status = isConnecting
    ? 'connecting'
    : isConnected
      ? 'connected'
      : 'disconnected';

  return (
    <div className="flex flex-col h-screen">
      {/* Status Bar */}
      <div className="relative h-[calc(100vh-4rem)]">
        <div
          className={cn(
            'fixed top-16 left-0 right-0 z-30', // Changed to fixed positioning
            'transition-all duration-300 transform',
            isExpanded
              ? 'translate-y-0 opacity-100'
              : '-translate-y-full opacity-0 pointer-events-none',
          )}
        >
          <ChatStatusBar status={status} />
        </div>

        <div className="z-20 relative">
          <ChatMessagesContainer isExpanded={isExpanded} isLoading={isLoading}>
            {messages.map((msg, index) => {
              const key = `${msg.type}-${index}`;
              switch (msg.type) {
                case 'user':
                case 'agent':
                  return (
                    <ChatMessage
                      key={key}
                      content={msg.content}
                      isAgent={msg.type === 'agent'}
                    />
                  );
                case 'strategy':
                  return (
                    <StrategyMessage
                      key={key}
                      strategy={msg.content.strategy}
                    />
                  );
                case 'transaction':
                  return <TransactionMessage key={key} {...msg.content} />;
                case 'vault':
                  return (
                    <VaultDetailsMessage
                      key={key}
                      {...msg.content}
                      onFund={() => {}}
                    />
                  );
                case 'opportunity':
                  return <OpportunityMessage key={key} {...msg.content} />;
                default:
                  return null;
              }
            })}
          </ChatMessagesContainer>
        </div>

        {/* Chat Input Area */}
        <div className="relative pt-2 pb-4">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            {' '}
            {/* Background info lowest */}
            <ChatInfo isExpanded={isExpanded} />
          </div>

          <div className="relative z-10">
            {' '}
            {/* Chat box above background */}
            <div className="flex justify-center">
              <div
                className={cn(
                  'transition-all duration-300 ease-in-out',
                  isExpanded ? 'w-full' : 'w-[768px]',
                )}
              >
                <ChatBox
                  onSend={handleSendMessage}
                  disabled={!isConnected}
                  loading={isLoading}
                  onFocus={() => setIsExpanded(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
