export interface MessageRequest {
  name: string;
  text: string;
}

export interface MessageResponse {
  user: string;
  text: string;
  action: 'IGNORE' | string; // We can expand this union as we discover more actions
  content: {
    success: boolean;
    [key: string]: unknown;
  };
}

export type BaseResponse = MessageResponse[];
