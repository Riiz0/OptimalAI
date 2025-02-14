'use client';

import { PrimaryButton } from '@/components/ui/primary-button';
import { SendIcon } from 'lucide-react';

interface ChatBoxProps {
  message: string;
  setMessage: (message: string) => void;
  disabled: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const ChatBox = ({
  message,
  setMessage,
  disabled,
  onFocus,
  onBlur,
}: ChatBoxProps) => {
  return (
    <div className="flex gap-2 p-4 rounded-lg bg-background-secondary focus-within:ring-1 focus-within:ring-primary">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={
          disabled
            ? 'Please connect your wallet to start using Optimal AI'
            : 'Ask me anything about DeFi strategies...'
        }
        className="flex-1 bg-transparent text-white px-4 py-2 focus:outline-none"
        disabled={disabled}
      />
      <PrimaryButton disabled={disabled || !message.trim()}>
        <div className="flex items-center gap-2">
          <SendIcon className="h-4 w-4" />
          <span className="font-medium text-white">Send</span>
        </div>
      </PrimaryButton>
    </div>
  );
};
