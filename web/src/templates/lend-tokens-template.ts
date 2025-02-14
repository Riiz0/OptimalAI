import { SUPPORTED_CHAINS_TYPES_STRING } from '../constants/supported-chains';

export const lendTokensTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the following information about the requested token lend:
- Protocol: The name of the lending protocol (aave or compound)
- Token: The address of the token to lend
- Amount: string representing the amount of token to lend (bigint)
- Chain: The chain of the token to lend

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "protocol": 'aave' | 'compound',
    "token": string | null,
    "amount": string | null,
    "chain": ${SUPPORTED_CHAINS_TYPES_STRING},
}
\`\`\`
`;
