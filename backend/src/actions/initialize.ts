import {
  type Action,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  ModelClass,
  type State,
  composeContext,
  generateObject,
} from '@elizaos/core';
import type { z } from 'zod';
import { getTypedDbAdapter } from '../adapters/extended-sqlite-adapter';
import { initializeTemplate } from '../templates/initialize-template';
import { userStateSchema } from '../validators/user-state-schema';

export const initializeAction: Action = {
  name: 'INITIALIZE_STATE',
  similes: ['INIT_STATE', 'INIT_USER', 'START', 'BEGIN'],
  description: 'Initialize the user state',

  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    if (!message.userId) {
      return false;
    }
    return true;
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    _options: {
      [key: string]: unknown;
    },
    callback: HandlerCallback,
  ) => {
    // Check if the user has already been initialized
    const dbAdapter = getTypedDbAdapter(runtime);
    const userState = await dbAdapter.getUserById(message.userId);
    if (userState) {
      callback({
        user: state.agentName,
        text: "Welcome to OptimalAI! Let's get you started.",
        action: 'INITIALIZE_STATE',
        content: {
          success: true,
        },
      });
      return true;
    }
    // Otherwise, update state and generate new user state
    let currentState = state;
    if (!currentState) {
      currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);
    const context = composeContext({
      state: currentState,
      template: initializeTemplate,
    });
    const { object } = (await generateObject({
      runtime,
      context,
      modelClass: ModelClass.SMALL,
      schema: userStateSchema,
    })) as { object: z.infer<typeof userStateSchema> };

    if (!object) {
      callback({
        user: state.agentName,
        text: 'There was an error initializing your account. Please try again.',
        action: 'INITIALIZE_STATE',
        content: {
          success: false,
        },
      });
      return true;
    }
    // Update the DB with the user's data
    await dbAdapter.createUserState(message.userId, object);
    callback({
      user: state.agentName,
      text: "Welcome to OptimalAI! Let's get you started.",
      action: 'INITIALIZE_STATE',
      content: {
        success: true,
      },
    });
    return true;
  },

  examples: [
    [
      {
        user: '{{user1}}',
        content: {
          text: 'Initialize {"walletAddress": "0x1234567890123456789012345678901234567890", "chainId": 1}',
        },
      },
      {
        user: '{{OptimalAI}}',
        content: {
          text: "Welcome to OptimalAI! Let's get you started.",
          action: 'INITIALIZE',
        },
      },
    ],
  ],
};
