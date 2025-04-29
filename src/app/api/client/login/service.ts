import { prisma } from '@/lib/prisma';

export const check_client_data = async (trainer_id: string, client_id: string) => {
  try {
    const client = await prisma.clients.findFirstOrThrow({
      where: {
        id: client_id,
        trainersId: trainer_id,
      },
    });

    return client;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
