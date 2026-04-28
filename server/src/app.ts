import Fastify from 'fastify';
import mercurius from 'mercurius';
import { userSchema } from './modules/user/user.schema';
import { userResolvers } from './modules/user/user.resolver';
import { taskSchema } from './modules/task/task.schema';
import { taskResolvers } from './modules/task/task.resolver';

import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

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

  const schema = mergeTypeDefs([userSchema, taskSchema]);
  const resolvers = mergeResolvers([userResolvers, taskResolvers]);

  app.register(mercurius as any, {
    schema,
    resolvers,
    graphiql: true // disable in production
  });

  // app.register(mercurius, {
  //   schema: taskSchema,
  //   resolvers: taskResolvers,
  //   graphiql: true
  // });

  return app;
};
