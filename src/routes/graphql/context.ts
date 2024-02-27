import { PrismaClient } from '@prisma/client';

export type ResolveContext = {
  prisma: PrismaClient;
};
