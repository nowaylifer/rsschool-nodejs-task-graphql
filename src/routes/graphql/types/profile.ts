import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { Profile } from '@prisma/client';
import { ResolveContext } from '../context.js';
import { MemberType } from './member-type.js';

export const ProfileType = new GraphQLObjectType<Profile, ResolveContext>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: (profile, _args, { prisma }) =>
        prisma.memberType.findUnique({ where: { id: profile.memberTypeId } }),
    },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve: (profile, _args, { prisma }) =>
        prisma.user.findUnique({ where: { id: profile.userId } }),
    },
  }),
});
