export const generateStrategyTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Act as a DeFi portfolio manager, analyze the following strategy description and create a structured portfolio strategy.
Create a strategy that includes:
1. Risk level (conservative, moderate, or aggressive)
2. Allocation percentages between lending and liquidity provision (must total 100%)
3. Description should be a short description of the strategy

If user doesn't give enough information about his strategy, return null.

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "description": string | null,
    "riskLevel": 'conservative' | 'moderate' | 'aggressive' | null,
    "allocations": {
        "lending": number,
        "liquidity": number,
    }
}
\`\`\`
`;
