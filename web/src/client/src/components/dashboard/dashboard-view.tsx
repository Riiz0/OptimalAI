import { Header } from '@/components/header';
import { PortfolioGraph } from '@/components/portfolio/portfolio-graph';
import { VaultDetails } from '@/components/vault/vault-details';

const mockPortfolioData = [
  { date: '2024-03-01', value: 3000 },
  { date: '2024-03-01', value: 3500 },
  { date: '2024-03-01', value: 3450 },
  { date: '2024-03-01', value: 3700 },
  { date: '2024-03-01', value: 3650 },
  { date: '2024-03-01', value: 3900 },
];

const mockVaultDetails = {
  address: '0xfB10339fA9eF9Ec7FB99f3393CEa13b5736bd061',
  isActive: true,
  createdAt: '1/2/2025',
  lastUpdate: '2/2/2025',
  strategy: {
    riskLevel: 'conservative',
    allocations: {
      lending: 100,
      liquidity: 0,
    },
    description:
      'A conservative strategy focused solely on lending. This will prioritize stability and capital preservation.',
  },
  balances: [
    {
      token: 'USDC',
      amount: '5000',
      symbol: 'USDC',
    },
    {
      token: 'USDT',
      amount: '5000',
      symbol: 'USDT',
    },
  ],
};

export const DashboardView = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col px-6 py-8">
        <h1 className="mb-8 text-3xl font-medium text-white">Dashboard</h1>

        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12 max-h-[700px] min-h-0">
          {/* Left Column - Vault Details (1/3) */}
          <div className="h-full lg:col-span-4 min-h-0">
            <div className="h-full overflow-auto">
              <VaultDetails
                address={mockVaultDetails.address}
                isActive={mockVaultDetails.isActive}
                createdAt={mockVaultDetails.createdAt}
                lastUpdate={mockVaultDetails.lastUpdate}
                balances={mockVaultDetails.balances}
                strategy={mockVaultDetails.strategy}
              />
            </div>
          </div>

          {/* Right Column - Portfolio Graph (2/3) */}
          <div className="h-full lg:col-span-8 min-h-0">
            <div className="h-full rounded-lg bg-[#1A212D] p-6">
              <PortfolioGraph data={mockPortfolioData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
