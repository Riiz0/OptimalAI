'use client';

import { cn } from '@/lib/utils';
import { ConnectKitButton } from 'connectkit';

export const ConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <button
            onClick={show}
            type="button"
            className={cn(
              'relative px-6 py-2 rounded-md group hover:opacity-90 transition-opacity text-white',
              isConnected && 'bg-background',
              !isConnected && 'bg-gradient-primary',
            )}
          >
            {/* Gradient Border */}
            {isConnected && (
              <span className="absolute inset-0 rounded-md bg-gradient-primary" />
            )}
            {isConnected && (
              <span className="absolute inset-[1px] rounded-md bg-background" />
            )}

            {/* Content */}
            <span className="relative text-white font-medium">
              {isConnected ? ensName || truncatedAddress : 'Connect Wallet'}
            </span>
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
