import { Logo } from '@/components/base/logo';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface ChatAvatarProps {
  isAgent?: boolean;
}

export const ChatAvatar = ({ isAgent }: ChatAvatarProps) => {
  return (
    <div
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full',
        !isAgent && 'bg-background-secondary',
      )}
    >
      {isAgent ? (
        <Logo className="h-8 w-8" />
      ) : (
        <User className="h-6 w-6 text-text-secondary" />
      )}
    </div>
  );
};
