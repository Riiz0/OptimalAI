import {
  type Action,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  type State,
  elizaLogger,
} from '@elizaos/core';
import {
  type SupportedChain,
  type WalletProvider,
  initWalletProvider,
} from '@elizaos/plugin-evm';
import type { Address } from 'viem';
import { getTypedDbAdapter } from '../adapters/extended-sqlite-adapter';
import { VAULT_DEPLOYER_ABI } from '../constants/vault-deployer-abi';
import { VAULT_DEPLOYER_ADDRESSES } from '../constants/vault-deployer-addresses';
import type { InitializeVaultParams } from '../types/initialize-vault-params';
import { getViemChainByName } from '../utils/get-viem-chain-by-name';

export class InitializeVaultAction {
  private walletProvider: WalletProvider;

  constructor(walletProvider: WalletProvider) {
    this.walletProvider = walletProvider;
  }

  async execute(params: InitializeVaultParams) {
    try {
      // TODO Need some kind of mapper to get the chain name used in the provider
      const chainName = 'baseSepolia';
      const publicClient = this.walletProvider.getPublicClient(
        chainName as SupportedChain,
      );
      const walletClient = this.walletProvider.getWalletClient(
        chainName as SupportedChain,
      );
      const { request } = await publicClient.simulateContract({
        address: VAULT_DEPLOYER_ADDRESSES[params.chain.id],
        abi: VAULT_DEPLOYER_ABI,
        functionName: 'deployVault',
        args: [params.userAddress as Address],
        chain: params.chain,
        account: walletClient.account,
      });
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });

      const vaultAddress = await publicClient.readContract({
        address: VAULT_DEPLOYER_ADDRESSES[params.chain.id],
        abi: VAULT_DEPLOYER_ABI,
        functionName: 'ownerToVault',
        args: [params.userAddress as Address],
      });
      return {
        hash,
        vaultAddress,
      };
    } catch (error) {
      console.error('Error in initialize vault action:', error);
      throw new Error('Failed to create vault. Please try again.');
    }
  }
}

export const initializeVaultAction: Action = {
  name: 'INITIALIZE_VAULT',
  similes: ['CREATE_VAULT', 'SETUP_VAULT', 'START_VAULT', 'DEPLOY_VAULT'],
  description: 'Creates a new vault for the user based on their strategy',

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    if (!message.userId) {
      return false;
    }
    const dbAdapter = getTypedDbAdapter(runtime);
    const userData = await dbAdapter.getUserById(message.userId);
    if (
      !userData ||
      !userData.walletAddress ||
      !userData.chainName ||
      !userData.strategy
    ) {
      return false;
    }
    return true;
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: {
      [key: string]: unknown;
    },
    callback: HandlerCallback,
  ) => {
    try {
      const walletProvider = await initWalletProvider(runtime);
      const action = new InitializeVaultAction(walletProvider);
      const dbAdapter = getTypedDbAdapter(runtime);
      const userData = await dbAdapter.getUserById(message.userId);
      const chain = getViemChainByName(userData.chainName);
      const result = await action.execute({
        strategy: userData.strategy,
        userAddress: userData.walletAddress,
        chain,
      });
      console.log('result', result);
      if (!result) {
        callback({
          user: state.agentName,
          text: 'Error creating vault. Please try again.',
          action: 'CONTINUE',
          content: {
            success: false,
          },
        });
        return true;
      }
      callback({
        user: state.agentName,
        text: `Vault was successfully created at ${result.vaultAddress} on ${chain.name}. You can now start funding it and I'll manage it according to your strategy.`,
        action: 'INITIALIZE_VAULT',
        nextAction: 'EXECUTE_STRATEGY',
        content: {
          success: true,
        },
      });
      return true;
    } catch (error) {
      elizaLogger.error('Error in initialize vault action:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  examples: [
    [
      {
        user: '{{user1}}',
        content: {
          text: 'I want to create a vault',
        },
      },
      {
        user: '{{OptimalAI}}',
        content: {
          text: "I'll help you create a vault. First, let's determine your investment strategy.",
          action: 'INITIALIZE_VAULT',
        },
      },
    ],
  ],
};
