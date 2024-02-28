import { User } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { ResolveContext } from '../context.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { UUIDType } from './uuid.js';

export const UserType = new GraphQLObjectType<User, ResolveContext>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (user, _args, { postsByUserLoader }) => postsByUserLoader.load(user.id),
    },
    profile: {
      type: ProfileType,
      resolve: (user, _args, { profileByUserLoader }) =>
        profileByUserLoader.load(user.id),
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (user, _args, { subscribedToUserLoader }) =>
        subscribedToUserLoader.load(user.id),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (user, _args, { userSubscribedToLoader }) =>
        userSubscribedToLoader.load(user.id),
    },
  }),
});

export const getUserQuery: GraphQLFieldConfig<null, ResolveContext, Pick<User, 'id'>> = {
  type: UserType as GraphQLObjectType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_source, { id }, { prisma }) => prisma.user.findUnique({ where: { id } }),
};

export const getUsersQuery: GraphQLFieldConfig<null, ResolveContext> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: (_source, _args, { prisma }) => prisma.user.findMany(),
};

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const createUserMutation: GraphQLFieldConfig<
  null,
  ResolveContext,
  { dto: Omit<User, 'id'> }
> = {
  type: new GraphQLNonNull(UserType),
  args: { dto: { type: new GraphQLNonNull(CreateUserInputType) } },
  resolve: (_source, { dto }, { prisma }) => prisma.user.create({ data: dto }),
};

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const changeUserMutation: GraphQLFieldConfig<
  null,
  ResolveContext,
  { id: User['id']; dto: Partial<Pick<User, 'name' | 'balance'>> }
> = {
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInputType) },
  },
  resolve: (_source, { id, dto }, { prisma }) =>
    prisma.user.update({ where: { id }, data: dto }),
};

export const deleteUserMutation: GraphQLFieldConfig<
  null,
  ResolveContext,
  Pick<User, 'id'>
> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, { id }, { prisma }) => {
    const deletedUser = await prisma.user.delete({ where: { id } });
    return Boolean(deletedUser);
  },
};

export const subscribeToMutation: GraphQLFieldConfig<
  null,
  ResolveContext,
  { userId: User['id']; authorId: User['id'] }
> = {
  type: new GraphQLNonNull(UserType),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_source, { userId, authorId }, { prisma }) =>
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userSubscribedTo: {
          create: {
            authorId,
          },
        },
      },
    }),
};

export const unsubscribeFromMutation: GraphQLFieldConfig<
  null,
  ResolveContext,
  { userId: User['id']; authorId: User['id'] }
> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_source, { userId, authorId }, { prisma }) => {
    const result = await prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: userId,
          authorId: authorId,
        },
      },
    });
    return Boolean(result);
  },
};
