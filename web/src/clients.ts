import { DirectClient } from '@elizaos/client-direct';
import type { IAgentRuntime } from '@elizaos/core';

export async function getClients({
  runtime,
}: {
  runtime: IAgentRuntime;
}) {
  const clients = [];
  const clientTypes =
    runtime.character.clients?.map((str) => str.toLowerCase()) || [];

  if (clientTypes.includes('auto')) {
    throw new Error('Auto client type is not supported');
  }

  if (clientTypes.includes('direct')) {
    const directClient = new DirectClient();
    clients.push(directClient);
  }

  if (runtime.character.plugins?.length > 0) {
    for (const plugin of runtime.character.plugins) {
      if (plugin.clients) {
        for (const client of plugin.clients) {
          clients.push(await client.start(runtime));
        }
      }
    }
  }

  return clients;
}
