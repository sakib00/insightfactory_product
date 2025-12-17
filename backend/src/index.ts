import app from './app';
import { config } from './config';
import { closeDatabase } from './database/connection';
import { Logger } from './utils/logger';

const port = config.port;

const server = app.listen(port, () => {
  Logger.info(`Server is running on http://localhost:${port}`);
  Logger.info(`Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
const shutdown = (signal: string): void => {
  Logger.info(`${signal} received, shutting down gracefully...`);

  server.close(() => {
    Logger.info('HTTP server closed');
    closeDatabase();
    Logger.info('Database connection closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    Logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
