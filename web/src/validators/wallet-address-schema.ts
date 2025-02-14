import { z } from 'zod';
import { addressSchema } from './address-schema';

export const walletAddressSchema = z.object({
  walletAddress: addressSchema
    .nullable()
    .describe('The wallet address to validate'),
});

export type WalletAddressSchema = z.infer<typeof walletAddressSchema>;
