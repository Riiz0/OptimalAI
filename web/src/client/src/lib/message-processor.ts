import { MockConversation } from '@/constants/mock-conversation';
import { useDemoStore } from '@/stores/demo-store';
import type { BaseResponse, MessageRequest } from '@/types/api';
import type {
  Message,
  MessageAction,
  OpportunityContent,
  TransactionContent,
  VaultContent,
} from '@/types/messages';
import type { Strategy } from '@/types/strategy';

export const processApiResponse = (response: BaseResponse): Message[] => {
  const messages: Message[] = [];

  for (const res of response) {
    switch (res.action) {
      case 'IGNORE':
        messages.push({ type: 'agent', content: res.text });
        break;
      case 'STRATEGY':
        if (res.content.success && res.content.strategy) {
          messages.push({
            type: 'strategy',
            content: { strategy: res.content.strategy as Strategy },
          });
        }
        break;
      case 'TRANSACTION':
        if (res.content.success && typeof res.content === 'object') {
          const { success, ...transactionContent } = res.content;
          messages.push({
            type: 'transaction',
            content: transactionContent as TransactionContent,
          });
        }
        break;
      case 'OPPORTUNITY':
        if (res.content.success && typeof res.content === 'object') {
          const { success, ...opportunityContent } = res.content;
          messages.push({
            type: 'opportunity',
            content: opportunityContent as OpportunityContent,
          });
        }
        break;
      case 'VAULT':
        if (res.content.success && typeof res.content === 'object') {
          const { success, ...vaultContent } = res.content;
          messages.push({
            type: 'vault',
            content: vaultContent as VaultContent,
          });
        }
        break;
    }
  }

  return messages;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockMessageIndex = 0;

const isStringContent = (content: Message['content']): content is string => {
  return typeof content === 'string';
};

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
      text: isStringContent(msg.content) ? msg.content : '',
      action,
      content:
        msg.type === 'agent'
          ? { success: true }
          : { success: true, ...(msg.content as Record<string, unknown>) },
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
  async send(_message: MessageRequest): Promise<BaseResponse> {
    const { isDemoMode } = useDemoStore.getState();

    if (isDemoMode) {
      return getMockResponse();
    }
    return [];
    // ... real API call logic
  },

  resetMockConversation() {
    mockMessageIndex = 0;
  },
};
