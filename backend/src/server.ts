import { createApp } from './app.js';
import { env } from './config/env.js';
import { testConnection, pool } from './config/db.js';
import { initializeDatabase } from './db/init.js';

async function bootstrap() {
  console.log('--- Starting Abel Gemstone Executive Backend ---');
  
  // Test PostgreSQL connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('CRITICAL: Unable to establish connection to PostgreSQL database.');
    console.error(`Check DATABASE_URL: ${env.DATABASE_URL}`);
  } else {
    try {
      // Check if tables are present, otherwise initialize
      const tablesRes = await pool.query(`
        SELECT COUNT(*)::int as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'gemstones'
      `);
      if (tablesRes.rows[0]?.count === 0) {
        console.log('[Bootstrap] Gemstones table not found, running database initialization...');
        await initializeDatabase();
      }
    } catch (err) {
      console.warn('[Bootstrap] Auto-init check warning:', err);
    }
  }

  const app = createApp();

  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`Abel Gemstone Backend is running on http://localhost:${env.PORT}`);
    console.log(`Health Check: http://localhost:${env.PORT}/api/health`);
    console.log(`Gemstones API: http://localhost:${env.PORT}/api/gemstones`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      console.log('HTTP server closed.');
      await pool.end();
      console.log('PostgreSQL pool drained.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
