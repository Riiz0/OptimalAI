import { cn } from '@/lib/utils';

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
      {/* Messages will go here */}
    </div>
  );
};
