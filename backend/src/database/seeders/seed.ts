import getDatabase from '../connection';

export const runSeeders = (): void => {
  const db = getDatabase();

  // Example seed data - uncomment if needed
  /*
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `);

  insertUser.run('John Doe', 'john@example.com', 'hashed_password');
  insertUser.run('Jane Smith', 'jane@example.com', 'hashed_password');
  */

  console.log('Seeders completed');
};
