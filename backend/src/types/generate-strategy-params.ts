import type { UserState } from './user-state';

export interface GenerateStrategyParams
  extends Pick<UserState, 'walletAddress'> {}
