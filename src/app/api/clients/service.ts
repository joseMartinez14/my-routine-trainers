import { AddClientForm, Client } from '@/app/dashboard/clients/type';
import { CommentSharp } from '@mui/icons-material';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export const create_new_client = async (trainer_uid: string, client_obj: AddClientForm) => {
  try {
    const client_id = getRandomString();
    const new_client = await prisma.clients.create({
      data: {
        id: client_id,
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
    throw error;
  }
};

export const delete_client = async (client_id: string) => {
  await prisma.clients.delete({
    where: {
      id: client_id,
    },
    // include: {
    //   ExerciseBodyPartsMap: {
    //     include: { bodyPart: true },
    //   },
    // },
  });

  return true;
};

export const get_one_client = async (trainer_id: string, client_id: string) => {
  const exercise = await prisma.clients.findUniqueOrThrow({
    where: {
      id: client_id,
    },
    // include: {
    //   ExerciseBodyPartsMap: {
    //     include: { bodyPart: true },
    //   },
    // },
  });

  return exercise;
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

export const edit_new_client = async (trainer_uid: string, client_obj: Client) => {
  try {
    const new_client = await prisma.clients.update({
      where: { id: client_obj.id },
      data: {
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
    console.error(error);
    throw error;
  }
};

function getRandomString(length: number = 5): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}
