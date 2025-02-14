import { Logo } from '@/components/base/logo';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  isAgent?: boolean;
}

const MessageAvatar = ({ isAgent }: { isAgent?: boolean }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full',
        isAgent ? 'bg-primary/10' : 'bg-background-secondary',
      )}
    >
      {isAgent ? (
        <Logo className="w-5 h-5" />
      ) : (
        <User className="w-4 h-4 text-text-secondary" />
      )}
    </div>
  );
};

export const ChatMessage = ({ content, isAgent }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-3',
        isAgent ? 'bg-background-secondary' : 'bg-transparent',
      )}
    >
      <MessageAvatar isAgent={isAgent} />
      <div className="flex-1">
        <p className="text-sm text-text-primary">{content}</p>
      </div>
    </div>
  );
};
