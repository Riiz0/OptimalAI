import { ChatLoading } from '@/components/chat/chat-loading';
import { cn } from '@/lib/utils';

interface ChatMessagesContainerProps {
  isExpanded: boolean;
  isLoading?: boolean;
}

export const ChatMessagesContainer = ({
  isExpanded,
  isLoading,
}: ChatMessagesContainerProps) => {
  return (
    <div
      className={cn(
        'overflow-y-auto transition-all duration-300',
        isExpanded ? 'h-[calc(100vh-18rem)]' : 'h-[30vh]',
      )}
    >
      {isLoading && <ChatLoading />}
    </div>
  );
};
