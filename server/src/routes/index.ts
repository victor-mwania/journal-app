import { FastifyInstance } from 'fastify';
import user from './user';
import journal from './journal';


export default async function (server: FastifyInstance) {
  server.register(user, { prefix: '/user' });
  server.register(journal, { prefix: '/journal' });

}
