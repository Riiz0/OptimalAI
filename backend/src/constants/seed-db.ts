export const seedDb = `
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

-- Table: user
CREATE TABLE IF NOT EXISTS "user" (
    "userId" TEXT PRIMARY KEY,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "walletAddress" TEXT,
    "vaultAddress" TEXT,
    "chainName" TEXT,
    "strategy" TEXT DEFAULT '{}' CHECK(json_valid("strategy")) -- Ensuring details is a valid JSON field,
);

COMMIT;
`;
