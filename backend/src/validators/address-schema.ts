import { type Address, isAddress } from 'viem';
import { string } from 'zod';

function validate(value: string): value is Address {
  return isAddress(value, { strict: false });
}

export const addressSchema = string().refine<Address>(validate, () => ({
  message: 'Invalid address',
}));
