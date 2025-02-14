import type { BaseResponse } from '@/types/api';
import type { Message } from '@/types/messages';
import type { Strategy } from '../../../types/strategy';

export const processApiResponse = (response: BaseResponse): Message[] => {
  const messages: Message[] = [];

  for (const res of response) {
    // Always add the text response as an agent message first
    if (res.text) {
      messages.push({ type: 'agent', content: res.text });
    }

    // Then add any special message types based on the action
    switch (res.action) {
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
            content: res.content.transaction as Message['content'],
          });
        }
        break;

      // Add other cases as needed
    }
  }

  return messages;
};
