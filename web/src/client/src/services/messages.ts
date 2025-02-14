import type { BaseResponse, MessageRequest } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

export const messagesService = {
  async send(message: MessageRequest): Promise<BaseResponse> {
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
};
