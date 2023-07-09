
import Fastify, { FastifyInstance} from 'fastify';
import { DbPlugin } from './plugins';
import routes from './routes';
import cron from 'node-cron';
import { sendJournals } from './utils';


const server: FastifyInstance = Fastify({logger: true});

server.register(DbPlugin);
server.register(routes);

export const start = async () => {
    try {
      try {
        // Schedule the cron job to run daily at 9:00 AM
        console.log('starting send journal cron job')
        cron.schedule(`*/10 * * * * * `, async() => {
          try {
            await sendJournals()
          } catch (error) {
            console.error('Failed to send journal entries:', error);
          }
        });
      }catch{
        console.error('error starting send journal cron job')
      }
      const port = 4000;
      await server.listen({ port, host: '0.0.0.0' });
      console.log(`Server listening on port ${port}`);
    } catch (err) {
      console.log(err);
      server.log.error(err);
      process.exit(1);
    }
  };
  
