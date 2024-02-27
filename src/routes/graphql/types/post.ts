import { GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { ResolveContext } from '../context.js';
import { GraphQLNonNull } from 'graphql';
import { Post } from '@prisma/client';

export const PostType = new GraphQLObjectType<Post, ResolveContext>({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: new GraphQLNonNull(UserType),
      resolve: async (post, _, { prisma }) =>
        prisma.user.findUnique({ where: { id: post.authorId } }),
    },
  }),
});
