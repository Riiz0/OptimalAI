import {
  type Action,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  ModelClass,
  type State,
  composeContext,
  elizaLogger,
  generateObject,
} from '@elizaos/core';
import { getTypedDbAdapter } from '../adapters/extended-sqlite-adapter';
import { generateStrategyTemplate } from '../templates/generate-strategy-template';
import { strategySchema } from '../validators/strategy-schema';
import {} from '../validators/wallet-address-schema';

export const generateStrategyAction: Action = {
  name: 'GENERATE_STRATEGY',
  similes: ['CREATE_STRATEGY', 'SETUP_STRATEGY', 'START_STRATEGY'],
  description: 'Generate a new investment strategy for the user',
  suppressInitialMessage: true,
  validate: async (runtime: IAgentRuntime, message: Memory) => {
    const dbAdapter = getTypedDbAdapter(runtime);
    const userData = await dbAdapter.getOrCreateUserState(message.userId);
    return !userData?.strategy; // Only valid if user doesn't already have a strategy
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: {
      [key: string]: unknown;
    },
    callback: HandlerCallback,
  ) => {
    try {
      // Compose bridge context
      const strategyContext = composeContext({
        state,
        template: generateStrategyTemplate,
      });
      const content = await generateObject({
        runtime,
        context: strategyContext,
        modelClass: ModelClass.LARGE,
        schema: strategySchema,
      });

      await runtime.databaseAdapter.createMemory(
        {
          userId: message.userId,
          agentId: state.agentId,
          roomId: state.roomId,
          content: {
            text: 'Successfully generated strategy',
            action: 'GENERATE_STRATEGY',
            strategy: content.object,
          },
        },
        'memories',
        true,
      );

      if (callback) {
        callback({
          user: state.agentName,
          text: 'Successfully generated strategy',
          action: 'GENERATE_STRATEGY',
          content: {
            success: true,
            strategy: content.object,
          },
        });
      }
      return true;
    } catch (error) {
      elizaLogger.error('Error in generate strategy action:', error);
      return true;
    }
  },

  examples: [
    [
      {
        user: '{{user1}}',
        content: {
          text: 'I want to create a strategy',
          userAddress: '{{userAddress}}',
        },
      },

      {
        user: '{{user1}}',
        content: {
          text: "Let's get started",
          userAddress: '{{userAddress}}',
        },
      },
    ],
  ],
};
