/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { ResolveContext } from '../context.js';
import { MemberTypeId } from './member-type-id.js';
import { MemberType } from './member-type.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { UserType } from './user.js';
import { UUIDType } from './uuid.js';

export const QueryType = new GraphQLObjectType<null, ResolveContext>({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (_source, _args, { prisma }) => prisma.user.findMany(),
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_source, args: { id: string }, { prisma }) =>
        prisma.user.findUnique({ where: { id: args.id } }),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (_source, _args, { prisma }) => prisma.post.findMany(),
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_source, args: { id: string }, { prisma }) =>
        prisma.post.findUnique({ where: { id: args.id } }),
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: (_source, _args, { prisma }) => prisma.profile.findMany(),
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_source, args: { id: string }, { prisma }) =>
        prisma.profile.findUnique({ where: { id: args.id } }),
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: (_source, _args, { prisma }) => prisma.memberType.findMany(),
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
      resolve: (_source, args: { id: string }, { prisma }) =>
        prisma.memberType.findUnique({ where: { id: args.id } }),
    },
  }),
});
