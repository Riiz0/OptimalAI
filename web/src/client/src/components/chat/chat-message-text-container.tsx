import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ChatMessageTextContainerProps {
  children: ReactNode;
  align?: 'left' | 'right';
}

export const ChatMessageTextContainer = ({
  children,
  align = 'left',
}: ChatMessageTextContainerProps) => {
  return (
    <div
      className={cn(
        'max-w-[70%] rounded-md bg-[#1A212D] p-2',
        'text-xs font-medium text-text-primary',
        align === 'right' && 'text-right',
      )}
    >
      {children}
    </div>
  );
};
