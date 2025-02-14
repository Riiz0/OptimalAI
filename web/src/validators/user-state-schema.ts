import { z } from 'zod';
import { addressSchema } from '../validators/address-schema';
import { strategySchema } from './strategy-schema';

export const userStateSchema = z.object({
  walletAddress: addressSchema.nullish(),
  chainName: z.string().nullish(),
  vaultAddress: addressSchema.nullish(),
  strategy: strategySchema.nullish(),
});
