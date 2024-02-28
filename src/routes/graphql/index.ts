import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { createDataLoaders } from './dataloaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const depthLimitErrors = validate(gqlSchema, parse(req.body.query), [
        depthLimit(5),
      ]);

      if (depthLimitErrors.length) {
        return { data: null, errors: depthLimitErrors };
      }

      return graphql({
        schema: gqlSchema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma, ...createDataLoaders(prisma) },
      });
    },
  });
};

export default plugin;
