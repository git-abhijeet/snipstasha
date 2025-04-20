import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global;

// Try-catch block to handle potential issues with PrismaClient initialization
let prisma;

try {
    prisma = globalForPrisma.prisma || new PrismaClient();
} catch (error) {
    console.error("Failed to initialize Prisma Client:", error);
    throw new Error("Could not initialize Prisma Client");
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
export { prisma };