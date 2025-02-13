export interface Strategy {
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  allocations: {
    lending: number;
    liquidity: number;
  };
  description: string;
}
