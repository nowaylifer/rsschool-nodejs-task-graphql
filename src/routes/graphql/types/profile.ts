import { Profile } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { ResolveContext } from '../context.js';
import { MemberTypeId } from './member-type-id.js';
import { MemberType } from './member-type.js';
import { UserType } from './user.js';
import { UUIDType } from './uuid.js';

export const ProfileType = new GraphQLObjectType<Profile, ResolveContext>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: (profile, _args, { memberTypeLoader }) =>
        memberTypeLoader.load(profile.memberTypeId),
    },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve: (profile, _args, { userLoader }) => userLoader.load(profile.userId),
    },
  }),
});

export const getProfileQuery: GraphQLFieldConfig<
  null,
  ResolveContext,
  Pick<Profile, 'id'>
> = {
  type: ProfileType as GraphQLObjectType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_source, { id }, { prisma }) => prisma.profile.findUnique({ where: { id } }),
};

export const getProfilesQuery: GraphQLFieldConfig<null, ResolveContext> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
  resolve: (_source, _args, { prisma }) => prisma.profile.findMany(),
};

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
  }),
});

export const createProfileMutation: GraphQLFieldConfig<
  null,
  ResolveContext,
  { dto: Omit<Profile, 'id'> }
> = {
  type: new GraphQLNonNull(ProfileType),
  args: { dto: { type: new GraphQLNonNull(CreateProfileInputType) } },
  resolve: (_source, { dto }, { prisma }) => prisma.profile.create({ data: dto }),
};

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeId },
  }),
});

export const changeProfileMutation: GraphQLFieldConfig<
  null,
  ResolveContext,
  {
    id: Profile['id'];
    dto: Partial<Pick<Profile, 'isMale' | 'yearOfBirth' | 'memberTypeId'>>;
  }
> = {
  type: new GraphQLNonNull(ProfileType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
  },
  resolve: (_source, { id, dto }, { prisma }) =>
    prisma.profile.update({ where: { id }, data: dto }),
};

export const deleteProfileMutation: GraphQLFieldConfig<
  null,
  ResolveContext,
  Pick<Profile, 'id'>
> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, { id }, { prisma }) => {
    const deletedProfile = await prisma.profile.delete({ where: { id } });
    return Boolean(deletedProfile);
  },
};
