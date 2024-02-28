import { MemberType as IMemberType } from '@prisma/client';
import {
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { ResolveContext } from '../context.js';
import { MemberTypeId } from './member-type-id.js';

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const getMemberTypeQuery: GraphQLFieldConfig<
  null,
  ResolveContext,
  Pick<IMemberType, 'id'>
> = {
  type: new GraphQLNonNull(MemberType),
  args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
  resolve: (_source, { id }, { prisma }) =>
    prisma.memberType.findUnique({ where: { id } }),
};

export const getMemberTypesQuery: GraphQLFieldConfig<null, ResolveContext> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
  resolve: (_source, _args, { prisma }) => prisma.memberType.findMany(),
};
