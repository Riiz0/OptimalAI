import type { Message } from '@/types/messages';

export const MockConversation: Message[] = [
  {
    type: 'agent',
    content:
      "Hello! I'll scan your wallet for potential DeFi opportunities. This will help us understand how we can optimize your returns. Give me a moment...",
  },
  {
    type: 'opportunity',
    content: {
      type: 'lending',
      protocol: 'aave',
      token: 'USDC',
      apy: 4.82,
      description: 'Earn stable yields by lending USDC on Aave',
      estimatedApy: '4.82% APY',
    },
  },
  {
    type: 'opportunity',
    content: {
      type: 'liquidity',
      protocol: 'aerodrome',
      token: 'USDC',
      pairToken: 'ETH',
      apy: 12.5,
    },
  },
  {
    type: 'agent',
    content:
      "I've found some interesting opportunities for your assets. Would you like me to help manage your funds to maximize these yields?",
  },
  {
    type: 'user',
    content: 'Yes, please help me manage my funds',
  },
  {
    type: 'agent',
    content:
      "Great! Let's create a personalized strategy. What's your risk tolerance? Would you prefer stable yields through lending, or are you open to higher returns through liquidity provision?",
  },
  {
    type: 'user',
    content: 'I prefer stable yields with some liquidity provision',
  },
  {
    type: 'agent',
    content:
      "I've designed a balanced strategy that focuses on stable yields while capturing some upside from liquidity pools:",
  },
  {
    type: 'strategy',
    content: {
      strategy: {
        riskLevel: 'moderate',
        allocations: {
          lending: 70,
          liquidity: 30,
        },
        description:
          'A balanced strategy with 70% allocation to lending protocols for stable yields, and 30% to curated liquidity pools for enhanced returns.',
      },
    },
  },
  {
    type: 'agent',
    content: 'Would you like me to create a vault with this strategy?',
  },
  {
    type: 'user',
    content: 'Yes, please create the vault',
  },
  {
    type: 'agent',
    content: "I've created your vault. Here are the details:",
  },
  {
    type: 'vault',
    content: {
      address: '0x1234...5678',
      isActive: true,
      createdAt: '2024-03-01',
      lastUpdate: '2024-03-01',
      balances: [
        {
          token: 'USDC',
          amount: '0',
          symbol: 'USDC',
        },
      ],
      strategy: {
        riskLevel: 'moderate' as const,
        allocations: {
          lending: 70,
          liquidity: 30,
        },
        description:
          'A balanced strategy with 70% allocation to lending protocols for stable yields, and 30% to curated liquidity pools for enhanced returns.',
      },
    },
  },
  {
    type: 'agent',
    content:
      'Please fund your vault to start implementing the strategy. You can use the "Fund" button above.',
  },
  {
    type: 'user',
    content: "I've funded the vault with 5000 USDC",
  },
  {
    type: 'agent',
    content:
      'Great! Would you like me to start implementing your strategy now?',
  },
  {
    type: 'user',
    content: 'Yes, please proceed',
  },
  {
    type: 'agent',
    content:
      "I'll now deploy your funds according to the strategy. Here are the actions I'm taking:",
  },
  {
    type: 'transaction',
    content: {
      type: 'lending',
      protocol: 'aave' as const,
      token: 'USDC',
      amount: '3,500',
      apy: 4.82,
      txHash: '0xabcd...1234',
      chainId: 8453,
    },
  },
  {
    type: 'transaction',
    content: {
      type: 'liquidity',
      protocol: 'aerodrome' as const,
      token: 'USDC',
      pairToken: 'ETH',
      amount: '1,500',
      apy: 12.5,
      txHash: '0xdef0...5678',
      chainId: 8453,
    },
  },
  {
    type: 'agent',
    content:
      "Perfect! I've deployed your funds according to the strategy. I'll continuously monitor the positions and rebalance when needed to maintain optimal yields. You can check your vault details anytime in the dashboard.",
  },
];
