import crypto from 'crypto';

export const generateId = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
