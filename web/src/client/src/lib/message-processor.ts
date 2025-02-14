import { MockConversation } from '@/constants/mock-conversation';
import type { BaseResponse } from '@/types/api';
import type { Message, MessageAction } from '@/types/messages';
import type { Strategy } from '../../../types/strategy';

export const processApiResponse = (response: BaseResponse): Message[] => {
  const messages: Message[] = [];

  for (const res of response) {
    switch (res.action) {
      case 'IGNORE':
        messages.push({ type: 'agent', content: res.text });
        break;
      case 'STRATEGY':
        if (res.content.success) {
          messages.push({
            type: 'strategy',
            content: { strategy: res.content.strategy as Strategy },
          });
        }
        break;
      case 'TRANSACTION':
        if (res.content.success) {
          messages.push({
            type: 'transaction',
            content: res.content,
          });
        }
        break;
      case 'OPPORTUNITY':
        if (res.content.success) {
          messages.push({
            type: 'opportunity',
            content: res.content,
          });
        }
        break;
      case 'VAULT':
        if (res.content.success) {
          messages.push({
            type: 'vault',
            content: res.content,
          });
        }
        break;
    }
  }

  return messages;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockMessageIndex = 0;

const getMockResponse = async (): Promise<BaseResponse> => {
  const messages: BaseResponse = [];
  const currentMessage = MockConversation[mockMessageIndex];

  if (!currentMessage) {
    return messages;
  }

  // Initial scanning delay
  if (mockMessageIndex === 0) {
    await delay(5000);
  }

  // Process current group of messages
  while (
    mockMessageIndex < MockConversation.length &&
    MockConversation[mockMessageIndex].type !== 'user'
  ) {
    const msg = MockConversation[mockMessageIndex];

    // Convert message type to API response format
    const action = msg.type.toUpperCase() as MessageAction;
    messages.push({
      user: 'agent',
      text: msg.type === 'agent' ? msg.content : '',
      action,
      content: {
        success: true,
        ...(msg.type === 'agent' ? {} : msg.content),
      },
    });

    mockMessageIndex++;

    if (
      mockMessageIndex < MockConversation.length &&
      MockConversation[mockMessageIndex].type !== 'user'
    ) {
      await delay(3000 + Math.random() * 2000);
    }
  }

  mockMessageIndex++;
  return messages;
};

export const messagesService = {
  async send(message: MessageRequest): Promise<BaseResponse> {
    const { isDemoMode } = useDemoStore.getState();

    if (isDemoMode) {
      return getMockResponse();
    }

    // ... real API call logic
  },

  resetMockConversation() {
    mockMessageIndex = 0;
  },
};
