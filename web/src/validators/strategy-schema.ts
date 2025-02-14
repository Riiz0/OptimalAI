import { z } from 'zod';

export const strategySchema = z.object({
  riskLevel: z.enum(['conservative', 'moderate', 'aggressive']),
  allocations: z
    .object({
      lending: z
        .number()
        .min(0)
        .max(100)
        .describe('Percentage allocated to lending protocols'),
      liquidity: z
        .number()
        .min(0)
        .max(100)
        .describe('Percentage allocated to liquidity provision'),
    })
    .refine((data) => data.lending + data.liquidity === 100, {
      message: 'Allocations must sum to 100%',
    }),
  description: z.string().min(1).max(500).describe('Strategy description'),
});

export type StrategySchema = z.infer<typeof strategySchema>;
