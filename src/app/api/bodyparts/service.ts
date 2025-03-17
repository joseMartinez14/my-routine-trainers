import { prisma } from '@/lib/prisma';

export const get_bodyparts = async () => {
  const bp = await prisma.bodyParts.findMany({});

  return bp;
};
