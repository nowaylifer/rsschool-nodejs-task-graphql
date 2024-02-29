import { PrismaClient } from '@prisma/client';
import { createDataLoaders } from './dataloaders.js';

export type ResolveContext = {
  prisma: PrismaClient;
} & ReturnType<typeof createDataLoaders>;
