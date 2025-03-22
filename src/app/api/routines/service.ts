import { ExerciseRoutineMap } from '@/app/dashboard/exercises/type';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import { ClientRoutineStat } from './type';

export const get_client_routines = async (trainer_uid: string, client_id: number) => {
  try {
    const routines = await prisma.routines.findMany({
      where: {
        trainerID: trainer_uid,
        clientID: client_id,
      },

      include: {
        ExerciseRoutineMap: {
          include: { exercise: true },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    //I need to take the details here.

    const return_data: ClientRoutineStat[] = [];

    routines.forEach((routine) => {
      //Siento que este aproach es muy ineficiente. No me gusta tener un for dentro de un for.
      //Pero no se a quien darle esa carga mas bien. Al cliente o al servidor. O a la base de datos
      //(Puede que sea la mejor) pero hacer ese query dentro de otro en prisma esta muy complejo

      const list_of_days: Set<number> = new Set();
      let sum_exercises: number = routine.ExerciseRoutineMap.length;

      routine.ExerciseRoutineMap.forEach((obj) => {
        list_of_days.add(obj.day);
      });

      return_data.push({
        routine_id: routine.id,
        routine_created_time: routine.createdAt.toISOString(),
        routine_name: routine.name,
        day_amount: list_of_days.size,
        avg_day_exercises: sum_exercises / list_of_days.size,
      });
    });

    return return_data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const create_new_routine = async (
  trainer_uid: string,
  client_id: number,
  routine_name: string,
  obj_list: ExerciseRoutineMap[]
) => {
  try {
    // Example list of exercise mappings
    console.log(trainer_uid);
    const obj_list_builed: Prisma.ExerciseRoutineMapCreateWithoutRoutineInput[] = obj_list.map((obj) => ({
      exercise: { connect: { id: obj.exercise.id } },
      day: Number(obj.day),
      reps: obj.reps,
      variation: obj.variation,
      weight: obj.weight,
    }));

    const new_routine = await prisma.routines.create({
      data: {
        name: routine_name,
        clientID: client_id,
        trainerID: trainer_uid,
        ExerciseRoutineMap: {
          create: obj_list_builed,
        },
      },
      include: {
        ExerciseRoutineMap: {
          include: { exercise: true },
        },
      },
    });
    return Response.json(new_routine);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
