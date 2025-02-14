import { ChatAvatar } from './chat-avatar';
import { ChatMessageContainer } from './chat-message-container';
import { ChatMessageTextContainer } from './chat-message-text-container';

const LoadingDots = () => {
  return (
    <div className="flex gap-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={`dot-${i}`}
          className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
};

export const ChatLoading = () => {
  return (
    <ChatMessageContainer isAgent={true}>
      <ChatAvatar isAgent={true} />
      <ChatMessageTextContainer>
        <span> </span>
        <LoadingDots />
      </ChatMessageTextContainer>
    </ChatMessageContainer>
  );
};
