import { PrismaClient } from '../generated/prisma_client'; // chemin standard après prisma generate
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Toujours obligatoire pour Neon (WebSockets)
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL ?? '';

const adapter = new PrismaNeon({ connectionString });

const prisma = new PrismaClient({
    adapter,
    // log: ['query', 'info', 'warn', 'error'], // décommente pour debug
});

export default prisma;
export { prisma };