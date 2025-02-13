import { SqliteDatabaseAdapter } from '@elizaos/adapter-sqlite';
import type { IAgentRuntime, UUID } from '@elizaos/core';
import type { Address } from 'viem';
import { seedDb } from '../constants/seed-db';
import type { Strategy } from '../types/strategy';
import type { UserState } from '../types/user-state';

export class ExtendedSqliteAdapter extends SqliteDatabaseAdapter {
  async init() {
    super.init();
    this.db.exec(seedDb);
  }

  async getOrCreateUserState(
    userId: UUID,
    userState?: UserState,
  ): Promise<UserState> {
    const dbState = await this.getUserById(userId);
    if (dbState) {
      return dbState;
    }
    if (!userState) {
      throw new Error('Need data to create user state');
    }
    await this.createUserState(userId, userState);
    return this.getUserById(userId);
  }

  async getUserById(userId: UUID): Promise<UserState | null> {
    const sql = 'SELECT * FROM user WHERE userId = ?';
    const userState = this.db.prepare(sql).get(userId) as UserState;
    if (userState) {
      if (typeof userState.strategy === 'string') {
        userState.strategy = JSON.parse(
          userState.strategy as unknown as string,
        );
      }
    }
    return userState;
  }

  async createUserState(userId: UUID, userState: UserState) {
    try {
      const sql =
        'INSERT INTO user (userId, walletAddress, vaultAddress, chainName, strategy) VALUES (?, ?, ?, ?, ?)';
      this.db
        .prepare(sql)
        .run(
          userId,
          userState.walletAddress,
          userState.vaultAddress,
          userState.chainName,
          JSON.stringify(userState.strategy),
        );

      return true;
    } catch (error) {
      console.log('Error creating user state', error);
      return false;
    }
  }

  async updateUserStrategy(userId: UUID, strategy: Strategy) {
    const sql = 'UPDATE user SET strategy = ? WHERE userId = ?';
    this.db.prepare(sql).run(JSON.stringify(strategy), userId);
  }

  async updateUserVaultAddress(userId: UUID, vaultAddress: Address) {
    const sql = 'UPDATE user SET vaultAddress = ? WHERE userId = ?';
    this.db.prepare(sql).run(vaultAddress, userId);
  }
}

export function getTypedDbAdapter(runtime: IAgentRuntime) {
  return runtime.databaseAdapter as ExtendedSqliteAdapter;
}
