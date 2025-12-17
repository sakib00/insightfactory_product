import { config } from './env';

export const databaseConfig = {
  filename: config.database.filename,
  options: {
    verbose: config.nodeEnv === 'development' ? console.log : undefined,
  },
};
