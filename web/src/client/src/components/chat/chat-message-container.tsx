import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ChatMessageContainerProps {
  children: ReactNode;
  isAgent?: boolean;
}

export const ChatMessageContainer = ({
  children,
  isAgent,
}: ChatMessageContainerProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3',
        !isAgent && 'flex-row-reverse',
        'justify-start',
      )}
    >
      {children}
    </div>
  );
};
