export const assignStrategyTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the user's strategy from the recent messages.

If you can't find the strategy, return null.

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
