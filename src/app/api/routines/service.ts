import { ExerciseRoutineMap } from '@/app/dashboard/exercises/type';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import { ClientRoutineStat, RoutinesStat } from './type';

export const get_client_routines = async (trainer_uid: string, client_id: number) => {
  try {
    const routines = await prisma.routines.findMany({
      where: {
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
        avg_day_exercises: parseFloat((sum_exercises / list_of_days.size).toFixed(2)),
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
  routine_comment: string,
  obj_list: ExerciseRoutineMap[]
) => {
  try {
    // Example list of exercise mappings
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
        comment: routine_comment,
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

export const get_trainer_routines = async (trainer_uid: string) => {
  try {
    const latestRoutinesData = await prisma.routines.groupBy({
      by: ['clientID'],
      _max: {
        createdAt: true,
      },
      where: {
        trainerID: trainer_uid,
      },
    });

    const latestCreatedAtDates = latestRoutinesData
      .map((r) => r._max.createdAt)
      .filter((date): date is Date => date !== null);

    const latestRoutines = await prisma.routines.findMany({
      where: {
        createdAt: {
          in: latestCreatedAtDates,
        },
        trainerID: trainer_uid,
      },
      include: {
        client: true,
        ExerciseRoutineMap: true,
      },
    });

    //I need to take the details here.

    const return_data: RoutinesStat[] = [];

    latestRoutines.forEach((routine) => {
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
        client_id: routine.client.id,
        client_name: routine.client.name,
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

export const get_routine_by_ID = async (routine_id: number) => {
  try {
    const routine = await prisma.routines.findUniqueOrThrow({
      where: { id: routine_id },
      include: {
        ExerciseRoutineMap: {
          include: {
            exercise: {
              include: {
                ExerciseBodyPartsMap: {
                  include: { bodyPart: true },
                },
              },
            },
          },
        },
        client: true,
      },
    });

    return routine;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const update_routine = async (
  routine_id: number,
  routine_name: string,
  routine_comment: string,
  obj_list: ExerciseRoutineMap[]
) => {
  try {
    await prisma.exerciseRoutineMap.deleteMany({
      where: { routinesID: routine_id },
    });

    // Example list of exercise mappings
    const obj_list_builed: Prisma.ExerciseRoutineMapCreateWithoutRoutineInput[] = obj_list.map((obj) => ({
      exercise: { connect: { id: obj.exercise.id } },
      day: Number(obj.day),
      reps: obj.reps,
      variation: obj.variation,
      weight: obj.weight,
    }));

    const updated_routine = await prisma.routines.update({
      where: { id: routine_id },
      data: {
        name: routine_name,
        comment: routine_comment,
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
    return Response.json(updated_routine);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
