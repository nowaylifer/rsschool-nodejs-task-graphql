import { Post } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { ResolveContext } from '../context.js';
import { UserType } from './user.js';
import { UUIDType } from './uuid.js';

export const PostType = new GraphQLObjectType<Post, ResolveContext>({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: new GraphQLNonNull(UserType),
      resolve: async (post, _, { userLoader }) => userLoader.load(post.authorId),
    },
  }),
});

export const getPostQuery: GraphQLFieldConfig<null, ResolveContext, Pick<Post, 'id'>> = {
  type: PostType as GraphQLObjectType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_source, { id }, { prisma }) => prisma.post.findUnique({ where: { id } }),
};

export const getPostsQuery: GraphQLFieldConfig<null, ResolveContext> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
  resolve: (_source, _args, { prisma }) => prisma.post.findMany(),
};

export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

export const createPostMutation: GraphQLFieldConfig<
  null,
  ResolveContext,
  { dto: Omit<Post, 'id'> }
> = {
  type: new GraphQLNonNull(PostType),
  args: { dto: { type: new GraphQLNonNull(CreatePostInputType) } },
  resolve: (_source, { dto }, { prisma }) => prisma.post.create({ data: dto }),
};

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export const changePostMutation: GraphQLFieldConfig<
  null,
  ResolveContext,
  { id: Post['id']; dto: Partial<Pick<Post, 'title' | 'content'>> }
> = {
  type: new GraphQLNonNull(PostType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangePostInputType) },
  },
  resolve: (_source, { id, dto }, { prisma }) =>
    prisma.post.update({ where: { id }, data: dto }),
};

export const deletePostMutation: GraphQLFieldConfig<
  null,
  ResolveContext,
  Pick<Post, 'id'>
> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, { id }, { prisma }) => {
    const deletedPost = await prisma.post.delete({ where: { id } });
    return Boolean(deletedPost);
  },
};
