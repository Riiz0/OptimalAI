import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().nonempty(),
  NETWORK_ID: z.string().optional().default('base-sepolia'),
  BASE_RPC_URL: z.string().nonempty(),
});

export function validateEnvironment(): void {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
}
