import fs from 'fs';
import path from 'path';
import { pool, testConnection } from '../config/db.js';

export async function initializeDatabase() {
  console.log('[Database] Checking schema initialization...');
  const connected = await testConnection();
  if (!connected) {
    throw new Error('Cannot initialize database: Connection to PostgreSQL failed');
  }

  const schemaPath = path.join(import.meta.dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(schemaSql);
    console.log('[Database] Tables & indexes initialized successfully.');
  } catch (err) {
    console.error('[Database] Schema execution error:', err);
    throw err;
  }
}

// Run standalone if executed directly
if (process.argv[1]?.endsWith('init.ts') || process.argv[1]?.endsWith('init.js')) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
