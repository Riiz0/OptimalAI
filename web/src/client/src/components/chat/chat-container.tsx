'use client';
import { SendIcon } from 'lucide-react';
import { useState } from 'react';

export const Chat = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-text-secondary mb-2">Hi there</h1>
        <h2 className="text-4xl font-semibold text-white mb-12">
          How can i help you ?
        </h2>

        <div className="w-full max-w-2xl">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please connect your wallet to start using Optimal AI"
              className="w-full bg-background-secondary text-white px-4 py-3 rounded-lg pr-12"
              disabled={true} // Enable when wallet is connected
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-lg disabled:opacity-50"
              disabled={true} // Enable when wallet is connected
            >
              <SendIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
