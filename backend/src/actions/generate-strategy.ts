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
import type { z } from 'zod';
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
    if (!message.userId) {
      return false;
    }
    const dbAdapter = getTypedDbAdapter(runtime);
    const userData = await dbAdapter.getUserById(message.userId);
    if (!userData || !userData.walletAddress || !userData.chainName) {
      return false;
    }
    return true;
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: {
      [key: string]: unknown;
    },
    callback: HandlerCallback,
  ) => {
    try {
      // Compose strategy
      const strategyContext = composeContext({
        state,
        template: generateStrategyTemplate,
      });
      const { object } = (await generateObject({
        runtime,
        context: strategyContext,
        modelClass: ModelClass.LARGE,
        schema: strategySchema,
      })) as { object: z.infer<typeof strategySchema> };

      const dbAdapter = getTypedDbAdapter(runtime);
      await dbAdapter.updateUserStrategy(message.userId, object);

      callback({
        user: state.agentName,
        text: 'Successfully generated strategy',
        action: 'GENERATE_STRATEGY',
        content: {
          success: true,
          strategy: object,
        },
      });

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
