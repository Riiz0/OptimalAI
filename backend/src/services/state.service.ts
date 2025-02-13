import type { IAgentRuntime, Memory } from '@elizaos/core';
import { getTypedDbAdapter } from '../adapters/extended-sqlite-adapter';

export async function getUserState(runtime: IAgentRuntime, message: Memory) {
  // Compose initial state
  const dbAdapter = getTypedDbAdapter(runtime);
  return await dbAdapter.getOrCreateUserState(message.userId);
}
