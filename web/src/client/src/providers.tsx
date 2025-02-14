'use client';

import { wagmiConfig } from '@/config/wagmi-config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            '--ck-body-color': '#FFFFFF',
            '--ck-border-radius': '8px',
            '--ck-overlay-background': '#00000008',
            '--ck-overlay-backdrop-filter': 'blur(0px)',

            // Primary Button
            '--ck-primary-button-color': '#FFFFFF',
            '--ck-primary-button-background': '#1A212D',
            '--ck-primary-button-box-shadow': '0 0 0 0 #ffffff',
            '--ck-primary-button-border-radius': '6px',
            '--ck-primary-button-font-weight': '600',
            '--ck-primary-button-hover-color': '#373737',
            '--ck-primary-button-hover-background': '#F0F2F5',
            '--ck-primary-button-hover-box-shadow': '0 0 0 0 #ffffff',
            '--ck-primary-button-active-background': '#F0F2F5',
            '--ck-primary-button-active-box-shadow': '0 0 0 0 #ffffff',

            // Modal
            '--ck-modal-box-shadow': '0px 2px 4px 0px #00000005',
            '--ck-body-background': '#10131A',
            '--ck-body-background-secondary': '#ffffff',
            '--ck-body-background-tertiary': '#ffffff',

            // Text
            '--ck-font-family': 'Inter',
            '--ck-body-color-muted': '#FFFFFF',
            '--ck-body-color-muted-hover': '#AAAABF',
            '--ck-body-color-danger': '#FF4E4E',
            '--ck-body-color-valid': '#32D74B',
            '--ck-modal-heading-font-weight': '500',

            // Miscellaneous
            '--ck-focus-color': '#1A88F8',
            '--ck-body-action-color': '#999999',
            '--ck-body-divider': '#f7f6f8',
            '--ck-qr-dot-color': '#000000',
            '--ck-qr-background': '#ffffff',
            '--ck-qr-border-color': '#f7f6f8',
            '--ck-qr-border-radius': '16px',
            '--ck-tooltip-color': '#999999',
            '--ck-tooltip-background': '#ffffff',
            '--ck-tooltip-background-secondary': '#ffffff',
            '--ck-tooltip-shadow': '0px 2px 10px 0 #00000014',
            '--ck-spinner-color': '#1A88F8',
            '--ck-recent-badge-color': '#777',
            '--ck-recent-badge-background': '#F6F7F9',
            '--ck-recent-badge-border-radius': '32px',
            '--ck-body-disclaimer-color': '#AAAAAB',
            '--ck-body-disclaimer-link-color': '#838485',
            '--ck-body-disclaimer-link-hover-color': '#000000',
            '--ck-body-disclaimer-background': '#f6f7f9',
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
