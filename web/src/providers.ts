import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { SqliteDatabaseAdapter } from '@elizaos/adapter-sqlite';
import {
  AgentRuntime,
  CacheManager,
  type Character,
  DbCacheAdapter,
  type IDatabaseCacheAdapter,
  ModelProviderName,
  elizaLogger,
} from '@elizaos/core';
import { bootstrapPlugin } from '@elizaos/plugin-bootstrap';
import Database from 'better-sqlite3';
import { character } from './character';

export async function getAgentRuntime() {
  const databaseAdapter = await getDBProvider();
  const token = getJWTToken();
  const cacheManager = await getCacheManager(character, databaseAdapter);
  const agentId =
    getAgentId() as `${string}-${string}-${string}-${string}-${string}`;

  return new AgentRuntime({
    databaseAdapter,
    token,
    modelProvider: ModelProviderName.OPENAI,
    character,
    agentId,

    // Extension points
    plugins: [bootstrapPlugin],
    providers: [],
    actions: [],
    services: [],
    managers: [],
    cacheManager,

    // Optional settings
    conversationLength: 32,
  });
}

// TODO
async function getCacheManager(
  character: Character,
  db: IDatabaseCacheAdapter,
) {
  const id = character.id;
  if (!id) {
    throw new Error('Character ID not set');
  }

  return new CacheManager(new DbCacheAdapter(db, id));
}

async function getDBProvider() {
  const filePath =
    process.env.SQLITE_FILE ?? path.resolve('./data', 'db.sqlite');
  elizaLogger.info(`Initializing SQLite database at ${filePath}...`);
  const db = new SqliteDatabaseAdapter(new Database(filePath));
  console.log('db', db);
  // Test the connection
  db.init()
    .then(() => {
      elizaLogger.success('Successfully connected to SQLite database');
    })
    .catch((error) => {
      elizaLogger.error('Failed to connect to SQLite:', error);
    });

  return db;
}

function getJWTToken() {
  const token = process.env.OPENAI_API_KEY;
  if (!token) {
    throw new Error('OPENAI_API_KEY not set');
  }

  return token;
}

function getAgentId() {
  return process.env.AGENT_ID || randomUUID();
}
