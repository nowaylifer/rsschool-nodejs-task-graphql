/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GraphQLObjectType } from 'graphql';
import { ResolveContext } from '../context.js';
import { getMemberTypeQuery, getMemberTypesQuery } from './member-type.js';
import { getPostQuery, getPostsQuery } from './post.js';
import { getProfileQuery, getProfilesQuery } from './profile.js';
import { getUserQuery, getUsersQuery } from './user.js';

export const QueryType = new GraphQLObjectType<null, ResolveContext>({
  name: 'Query',
  fields: () => ({
    users: getUsersQuery,
    user: getUserQuery,
    posts: getPostsQuery,
    post: getPostQuery,
    profiles: getProfilesQuery,
    profile: getProfileQuery,
    memberTypes: getMemberTypesQuery,
    memberType: getMemberTypeQuery,
  }),
});
