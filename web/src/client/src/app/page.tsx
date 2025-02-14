'use client';
import { ChatContainer } from '@/components/chat/chat-container';
import { Header } from '@/components/header';
import { useDemoStore } from '@/stores/demo-store';
import { useEffect } from 'react';

export default function Home() {
  const { toggleDemoMode } = useDemoStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDemoMode();
        console.log('Demo mode toggled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDemoMode]);

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <ChatContainer />
      </div>
    </main>
  );
}
