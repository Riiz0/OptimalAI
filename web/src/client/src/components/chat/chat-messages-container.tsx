import { cn } from '@/lib/utils';
import { ChatMessage } from './chat-message';

interface ChatMessagesContainerProps {
  isExpanded: boolean;
}

export const ChatMessagesContainer = ({
  isExpanded,
}: ChatMessagesContainerProps) => {
  return (
    <div
      className={cn(
        'overflow-y-auto transition-all duration-300',
        isExpanded ? 'h-[calc(100vh-18rem)]' : 'h-[30vh]',
      )}
    >
      <ChatMessage
        isAgent={true}
        content="Before we can start implementing your strategy, you'll need to fund your vault. Please select a token to deposit:"
      />
      <ChatMessage content="I'd like to deposit USDC" />
    </div>
  );
};
