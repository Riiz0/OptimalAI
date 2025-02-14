import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ChatSubMessageContainerProps {
  children: ReactNode;
  className?: string;
}

export const ChatSubMessageContainer = ({
  children,
  className,
}: ChatSubMessageContainerProps) => {
  return (
    <div className={cn('ml-[44px] flex items-start px-4 pb-3', className)}>
      {children}
    </div>
  );
};
