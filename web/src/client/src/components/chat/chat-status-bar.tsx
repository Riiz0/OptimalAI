import { cn } from '@/lib/utils';
import { useAccount } from 'wagmi';

export const ChatStatusBar = () => {
  const { isConnected, isConnecting } = useAccount();

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <span className="font-medium">Optimal AI</span>
      <div
        className={cn(
          'px-2.5 py-1.5 rounded-md border text-sm font-medium',
          isConnected && 'border-green-500 text-white bg-green-500/20',
          isConnecting &&
            'border-yellow-500/20 text-yellow-500 bg-yellow-500/10',
          !isConnected &&
            !isConnecting &&
            'border-red-500/20 text-red-500 bg-red-500/10',
        )}
      >
        {isConnected
          ? 'Connected'
          : isConnecting
            ? 'Connecting...'
            : 'Disconnected'}
      </div>
    </div>
  );
};
