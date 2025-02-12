import { getClients } from './clients';
import { getAgentRuntime } from './providers';

async function main() {
  try {
    console.log('Starting agent...');
    const runtime = await getAgentRuntime();
    await runtime.initialize();
    console.log('Agent initialized');
    await getClients({ runtime });
    console.log('Clients initialized');
  } catch (err) {
    console.error('Error starting agent:', err);
    process.exit(1);
  }
}

main();
