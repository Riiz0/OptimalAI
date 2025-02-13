export const initializeTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

Extract the user's data from the last user's message. The message should be in the format of "INITIALIZE_USER {"walletAddress": "0x1234567890123456789012345678901234567890", "chainId": 1}".
If you can't find the data, return null.

The data should be a JSON object following the schema below.
{
    "walletAddress": string,
    "chainName": string
}

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "walletAddress": string | null,
    "chainName": string | null
}
\`\`\`
`;
