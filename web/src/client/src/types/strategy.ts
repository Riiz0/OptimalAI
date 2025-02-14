export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';

export interface Strategy {
  riskLevel: RiskLevel;
  allocations: {
    lending: number;
    liquidity: number;
  };
  description: string;
}
