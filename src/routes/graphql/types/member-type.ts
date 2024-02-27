import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLInt } from 'graphql';
import { MemberTypeId } from './member-type-id.js';

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});
