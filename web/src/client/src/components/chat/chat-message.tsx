import { ChatAvatar } from './chat-avatar';
import { ChatMessageContainer } from './chat-message-container';
import { ChatMessageTextContainer } from './chat-message-text-container';

interface ChatMessageProps {
  content: string;
  isAgent?: boolean;
}

export const ChatMessage = ({ content, isAgent }: ChatMessageProps) => {
  return (
    <ChatMessageContainer isAgent={isAgent}>
      <ChatAvatar isAgent={isAgent} />
      <ChatMessageTextContainer align={isAgent ? 'left' : 'right'}>
        {content}
      </ChatMessageTextContainer>
    </ChatMessageContainer>
  );
};
