import {
  type Action,
  type IAgentRuntime,
  type Memory,
  ModelClass,
  type State,
  composeContext,
  elizaLogger,
  generateObjectDeprecated,
} from '@elizaos/core';
import { type WalletProvider, initWalletProvider } from '@elizaos/plugin-evm';
import { lendTokensTemplate } from '../templates/lend-tokens-template';
import type { LendTokensParams } from '../types/lend-tokens-params';

export class LendTokensAction {
  private walletProvider: WalletProvider;

  constructor(walletProvider: WalletProvider) {
    this.walletProvider = walletProvider;
  }

  async lendTokens(params: LendTokensParams, message: Memory, state?: State) {
    const walletClient = this.walletProvider.getWalletClient(params.chain);

    elizaLogger.info('Lending with params:', {
      userData,
      strategies,
      apys,
      params,
      walletAddress: walletClient.account.address,
    });

    // TODO: Implement actual lending logic
    return true;
  }
}

export const lendTokensAction: Action = {
  name: 'LEND_TOKENS',
  similes: ['LEND_AAVE', 'LEND_COMPOUND', 'LEND'],
  description:
    'Lends on tokens using our vault API (support Aave, Compound on Base, Arbitrum, Optimism (OP))',

  // Validate input before triggering action
  validate: async (runtime: IAgentRuntime, message: Memory) => {
    return true;
  },

  handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    try {
      const walletProvider = await initWalletProvider(runtime);
      const action = new LendTokensAction(walletProvider);

      const lendTokensContext = composeContext({
        state,
        template: lendTokensTemplate,
      });
      const content = await generateObjectDeprecated({
        runtime,
        context: lendTokensContext,
        modelClass: ModelClass.LARGE,
      });

      await action.lendTokens({ ...content }, message, state);

      // const provider = runtime.providers.getProvider('baseSepolia');
      //   const provider = new ethers.JsonRpcProvider(
      //     process.env.EVM_PROVIDER_BASESEPOLIA
      //   );
      //   const signer = new ethers.Wallet(process.env.EVM_PRIVATE_KEY, provider);
      //   const userAddress = await signer.getAddress();
      //   const vaultFactoryContract = new ethers.Contract(
      //     vaultFactoryAddress,
      //     VaultFactoryABI,
      //     provider
      //   );
      //   const contractWithSigner = vaultFactoryContract.connect(signer);

      //   // REST OF THE LOGIC BELOW

      //   //   const tx = await contractWithSigner.createVault(userAddress);
      //   //   const receipt = await tx.wait();
      //   //   elizaLogger.log("Vault created:", receipt);
      elizaLogger.log('Vault created:');
      console.log('Vault created: EXECUTED HANDLER FOR LEND_ON_AAVE_ACTION');
      return true;
    } catch (error) {
      console.error('Lending on Aave failed:', error);
      return false;
    }
  },

  examples: [
    [
      {
        user: '{{user1}}',
        content: {
          text: 'Can you lend on Aave?',
        },
      },
      {
        user: '{{OptimalAI}}',
        content: {
          text: "I'll lend on Aave for you",
          action: 'LEND_ON_AAVE',
        },
      },
    ],
  ],
};
