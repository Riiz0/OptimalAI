import { cn } from '@/lib/utils';

interface ChatStatusBarProps {
  status:
    | 'connected'
    | 'connecting'
    | 'initializing'
    | 'error'
    | 'disconnected';
}

export const ChatStatusBar = ({ status }: ChatStatusBarProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <span className="font-medium">Optimal AI</span>
      <div
        className={cn(
          'px-2.5 py-1.5 rounded-md border text-sm font-medium',
          status === 'connected' &&
            'border-green-500 text-white bg-green-500/20',
          status === 'connecting' ||
            (status === 'initializing' &&
              'border-yellow-500/20 text-yellow-500 bg-yellow-500/10'),
          (status === 'error' || status === 'disconnected') &&
            'border-red-500/20 text-red-500 bg-red-500/10',
        )}
      >
        {status === 'connected'
          ? 'Connected'
          : status === 'connecting'
            ? 'Connecting...'
            : status === 'initializing'
              ? 'Initializing...'
              : 'Disconnected'}
      </div>
    </div>
  );
};
