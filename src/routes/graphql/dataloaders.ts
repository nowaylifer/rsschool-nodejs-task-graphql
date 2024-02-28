import { MemberType, PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';
import { groupBy, keyBy } from './utils.js';

type UserWithSubs = User & { subscribedToUser: { subscriber: User }[] };
type UserWithAuthors = User & { userSubscribedTo: { author: User }[] };

const hydrateSubscribedToUser = (
  usersWithSubs: UserWithSubs[],
  userIds: ReadonlyArray<User['id']>,
) => {
  const subsMap = groupBy(usersWithSubs, (record) => record.id);

  return userIds.map(
    (id) =>
      subsMap[id]?.flatMap((r) => r.subscribedToUser.map((v) => v.subscriber)) ?? [],
  );
};

const hydrateUserSubscribedTo = (
  usersWithAuthors: UserWithAuthors[],
  userIds: ReadonlyArray<User['id']>,
) => {
  const authorsMap = groupBy(usersWithAuthors, (record) => record.id);

  return userIds.map(
    (id) => authorsMap[id]?.flatMap((r) => r.userSubscribedTo.map((v) => v.author)) ?? [],
  );
};

export const createDataLoaders = (prisma: PrismaClient) => ({
  postsByUserLoader: new DataLoader(async (userIds: ReadonlyArray<User['id']>) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: [...userIds] } },
    });
    const postsMap = groupBy(posts, (post) => post.authorId);
    return userIds.map((id) => postsMap[id] ?? []);
  }),

  userLoader: new DataLoader(async (userIds: ReadonlyArray<User['id']>) => {
    const users = await prisma.user.findMany({ where: { id: { in: [...userIds] } } });
    const usersMap = keyBy(users, (user) => user.id);
    return userIds.map((id) => usersMap[id]);
  }),

  memberTypeLoader: new DataLoader(
    async (memberTypeIds: ReadonlyArray<MemberType['id']>) => {
      const memberTypes = await prisma.memberType.findMany({
        where: { id: { in: [...memberTypeIds] } },
      });
      const memberTypesMap = keyBy(memberTypes, (mt) => mt.id);
      return memberTypeIds.map((id) => memberTypesMap[id]);
    },
  ),

  profileByUserLoader: new DataLoader(async (userIds: ReadonlyArray<User['id']>) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: [...userIds] } },
    });
    const profilesMap = keyBy(profiles, (profile) => profile.userId);
    return userIds.map((id) => profilesMap[id]);
  }),

  subscribedToUserLoader: new DataLoader(async (userIds: ReadonlyArray<User['id']>) => {
    const usersWithSubs = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
      include: { subscribedToUser: { select: { subscriber: true } } },
    });
    return hydrateSubscribedToUser(usersWithSubs, userIds);
  }),

  userSubscribedToLoader: new DataLoader(async (userIds: ReadonlyArray<User['id']>) => {
    const usersWithAuthors = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
      include: { userSubscribedTo: { select: { author: true } } },
    });
    return hydrateUserSubscribedTo(usersWithAuthors, userIds);
  }),
});
