import { MockConversation } from '@/constants/mock-conversation';
import { useDemoStore } from '@/stores/demo-store';
import type { BaseResponse, MessageRequest } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockMessageIndex = 0;

const getMockResponse = async (): Promise<BaseResponse> => {
  // Get next message(s) from mock conversation
  const messages: BaseResponse = [];
  const currentMessage = MockConversation[mockMessageIndex];

  if (!currentMessage) {
    return messages;
  }

  // Add messages until we hit a user message or end of conversation
  while (
    mockMessageIndex < MockConversation.length &&
    MockConversation[mockMessageIndex].type !== 'user'
  ) {
    messages.push({
      user: 'agent',
      text:
        MockConversation[mockMessageIndex].type === 'agent'
          ? MockConversation[mockMessageIndex].content
          : '',
      action:
        MockConversation[mockMessageIndex].type === 'agent'
          ? 'IGNORE'
          : MockConversation[mockMessageIndex].type.toUpperCase(),
      content: {
        success: true,
        ...MockConversation[mockMessageIndex].content,
      },
    });
    mockMessageIndex++;
  }

  // Skip the next user message to prepare for next response
  mockMessageIndex++;

  // Add random delay between 1-2 seconds
  await delay(1000 + Math.random() * 1000);
  return messages;
};

export const messagesService = {
  async send(message: MessageRequest): Promise<BaseResponse> {
    const { isDemoMode } = useDemoStore.getState();

    if (isDemoMode) {
      return getMockResponse();
    }

    const response = await fetch(
      `${API_URL}/416659f6-a8ab-4d90-87b5-fd5635ebe37d/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  },

  resetMockConversation() {
    mockMessageIndex = 0;
  },
};
