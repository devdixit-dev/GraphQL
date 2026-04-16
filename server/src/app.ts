import Fastify from 'fastify';
import mercurius from 'mercurius';
import { userSchema } from './modules/user/user.schema';
import { userResolvers } from './modules/user/user.resolver';

export const buildApp = () => {
  const app = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          colorize: true
        }
      }
    }
  });

  app.register(mercurius, {
    schema: userSchema,
    resolvers: userResolvers,
    graphiql: true // disable in production
  });

  return app;
};