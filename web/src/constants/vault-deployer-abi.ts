export const VAULT_DEPLOYER_ABI = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'IS_SCRIPT',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'currentNetworkConfig',
    inputs: [],
    outputs: [
      {
        name: 'weth',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'usdc',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'aaveUsdc',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'compoundUsdc',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'uniswapFactory',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'uniswapRouter',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'uniswapQouter',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'aavePool',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'agent',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deployVault',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'vaultAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'fetchVaultAddress',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAnvilConfig',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct HelperConfig.NetworkConfig',
        components: [
          {
            name: 'weth',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'usdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'aaveUsdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'compoundUsdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapFactory',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapQouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'aavePool',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'agent',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'getArbitrumSepoliaConfig',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct HelperConfig.NetworkConfig',
        components: [
          {
            name: 'weth',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'usdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'aaveUsdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'compoundUsdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapFactory',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapQouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'aavePool',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'agent',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'getAvaxFujiConfig',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct HelperConfig.NetworkConfig',
        components: [
          {
            name: 'weth',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'usdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'aaveUsdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'compoundUsdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapFactory',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapQouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'aavePool',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'agent',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'getBaseSepoliaConfig',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct HelperConfig.NetworkConfig',
        components: [
          {
            name: 'weth',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'usdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'aaveUsdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'compoundUsdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapFactory',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapQouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'aavePool',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'agent',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'getETHSepoliaConfig',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct HelperConfig.NetworkConfig',
        components: [
          {
            name: 'weth',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'usdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'aaveUsdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'compoundUsdc',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapFactory',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapRouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'uniswapQouter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'aavePool',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'agent',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'ownerToVault',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'NewVaultDeployed',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'vaultAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'HelperConfig__InvalidChainId',
    inputs: [],
  },
] as const;
