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
import { assignStrategyTemplate } from '../templates/assign-strategy-template';
import type { Strategy } from '../types/strategy';
import { strategySchema } from '../validators/strategy-schema';

export const assignStrategyAction: Action = {
  name: 'ASSIGN_STRATEGY',
  similes: ['ASSIGN_STRATEGY', 'SET_STRATEGY', 'UPDATE_STRATEGY'],
  description: 'Assign an investment strategy to the user',

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
      const strategyContext = composeContext({
        state,
        template: assignStrategyTemplate,
      });
      const content = await generateObject({
        runtime,
        context: strategyContext,
        modelClass: ModelClass.LARGE,
        schema: strategySchema,
      });

      if (!content.object) {
        callback({
          user: state.agentName,
          text: 'Could not assign strategy, no strategy found',
          action: 'ASSIGN_STRATEGY',
          content: {
            success: false,
          },
        });
        return true;
      }

      await runtime.databaseAdapter.createMemory(
        {
          userId: message.userId,
          agentId: state.agentId,
          roomId: state.roomId,
          content: {
            text: 'Successfully assigned strategy',
            action: 'ASSIGN_STRATEGY',
            strategy: content.object,
          },
        },
        'memories',
        true,
      );

      const dbAdapter = getTypedDbAdapter(runtime);
      await dbAdapter.updateUserStrategy(
        message.userId,
        content.object as Strategy,
      );

      if (callback) {
        callback({
          user: state.agentName,
          text: 'Successfully assigned strategy',
          action: 'ASSIGN_STRATEGY',
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
          text: 'I want to assign a strategy',
          userAddress: '{{userAddress}}',
          strategy: '{{strategy}}',
        },
      },
      {
        user: '{{user2}}',
        content: {
          text: "Let's get started with this strategy",
          userAddress: '{{userAddress}}',
          strategy: '{{strategy}}',
        },
      },
    ],
  ],
};
