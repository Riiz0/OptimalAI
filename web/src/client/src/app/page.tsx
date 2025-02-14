import { ChatContainer } from '@/components/chat/chat-container';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <ChatContainer />
      </div>
    </main>
  );
}
