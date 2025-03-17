import { AddClientForm } from '@/app/dashboard/clients/add/type';
import { CommentSharp } from '@mui/icons-material';

import { prisma } from '@/lib/prisma';

export const create_new_client = async (trainer_uid: string, client_obj: AddClientForm) => {
  try {
    const new_client = await prisma.clients.create({
      data: {
        trainersId: trainer_uid,
        name: client_obj.name,
        phone: client_obj.phone,
        anatomy: client_obj.anatomy,
        injuries: client_obj.injuries,
        objective: client_obj.objective,
        experience: client_obj.experience,
        weeklyTrainingDays: Number(client_obj.weeklyTrainingDays),
        trainingMinutes: Number(client_obj.trainingMinutes),
      },
    });
    return Response.json(new_client);
  } catch (error: any) {
    console.log('Me cago en toda la mierda');
    console.log(error);
    throw error;
  }
};

export const get_trainer_clients = async (trainer_id: string) => {
  const clients = await prisma.clients.findMany({
    where: {
      trainersId: trainer_id,
    },
    include: {
      routines: true,
    },
  });

  return clients;
};
