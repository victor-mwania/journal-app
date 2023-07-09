import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from 'prisma/prisma-client';
import fastifyPlugin from 'fastify-plugin';
import dotenv from 'dotenv';

dotenv.config();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;
const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

const url = `postgresql://${user}:${password}@${host}:${port}/${dbName}?connect_timeout=300`;

export const db = new PrismaClient({
  datasources: { db: { url } },
  log: [
    { level: 'info', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
    { level: 'error', emit: 'stdout' },
  ],
});

db.$connect();

declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient;
  }
}

export const DbPlugin: FastifyPluginAsync = fastifyPlugin(
  async (server) => {
    server.decorate('db', db);

    server.addHook('onClose', async (server) => {
      await server.db.$disconnect();
    });
  },
);
