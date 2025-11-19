import { PrismaClient } from '@prisma/client';

// 1. Extend the global object to include a reference to the PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 2. Use the global instance if it exists, otherwise create a new one.
// This prevents multiple instances of Prisma Client in development (due to HMR).
const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// 3. In a development environment, store the instance in the global object
// so that subsequent reloads reuse the same connection.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// 4. Export the single, reliable instance
export { prisma };