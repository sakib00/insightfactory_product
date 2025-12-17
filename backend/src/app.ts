import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import getDatabase from './database/connection';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware';
import { Logger } from './utils/logger';
import { swaggerSpec } from './config/swagger';
import fs from 'fs';
import path from 'path';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  Logger.info(`${req.method} ${req.url}`);
  next();
});

// Initialize database and run migrations
const initializeDatabase = (): void => {
  const db = getDatabase();

  try {
    // Run migrations
    const migrationsDir = path.join(__dirname, 'database', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();

    for (const file of migrationFiles) {
      if (file.endsWith('.sql')) {
        Logger.info(`Running migration: ${file}`);
        const migration = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        db.exec(migration);
      }
    }

    Logger.info('Database migrations completed successfully');
  } catch (error) {
    Logger.error('Failed to run migrations:', error);
    throw error;
  }
};

// Initialize database
initializeDatabase();

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Backend API Docs',
}));

// Swagger JSON
app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
