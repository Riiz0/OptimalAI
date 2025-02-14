'use client';

import { PrimaryButton } from '@/components/ui/primary-button';
import { SendIcon } from 'lucide-react';
import { useState } from 'react';

interface ChatBoxProps {
  disabled: boolean;
  loading: boolean;
  onSend: (message: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const ChatBox = ({
  disabled,
  loading,
  onSend,
  onFocus,
  onBlur,
}: ChatBoxProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 p-4 rounded-lg bg-background-secondary focus-within:ring-1 focus-within:ring-primary">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={
          disabled
            ? 'Please connect your wallet to start using Optimal AI'
            : loading
              ? 'Thinking...'
              : 'Ask me anything about DeFi strategies...'
        }
        className="flex-1 bg-transparent text-white px-4 py-2 focus:outline-none"
        disabled={disabled || loading}
      />
      <PrimaryButton
        disabled={disabled || loading || !message.trim()}
        onClick={handleSend}
      >
        <div className="flex items-center gap-2">
          <SendIcon className="h-4 w-4" />
          <span className="font-medium text-white">Send</span>
        </div>
      </PrimaryButton>
    </div>
  );
};
