import { ChatLoading } from '@/components/chat/chat-loading';
import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

interface ChatMessagesContainerProps extends PropsWithChildren {
  isExpanded: boolean;
  isLoading?: boolean;
}

export const ChatMessagesContainer = ({
  isExpanded,
  isLoading,
  children,
}: ChatMessagesContainerProps) => {
  return (
    <div
      className={cn(
        'overflow-y-auto',
        'transition-all duration-300',
        isExpanded
          ? 'h-[calc(100vh-18rem)] pt-12' // Added padding-top for status bar
          : 'h-[30vh] opacity-0',
      )}
    >
      {children}
      {isLoading && <ChatLoading />}
    </div>
  );
};
