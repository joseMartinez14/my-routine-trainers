import { prisma } from '@/lib/prisma';

import { RoutineDayExercises } from '../home/type';

export const get_day_routine = async (routine_id: number, day: number): Promise<RoutineDayExercises> => {
  try {
    const routine = await prisma.routines.findFirst({
      where: {
        id: routine_id,
      },
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
        trainer: true,
      },
    });

    const return_data: RoutineDayExercises = {
      name: routine?.name || '',
      comment: routine?.comment || '',
      exercises_routine_map: [],
    };

    routine?.ExerciseRoutineMap.forEach((item) => {
      if (item.day == day) {
        return_data.exercises_routine_map.push({ ...item, routineID: routine_id });
      }
    });

    return return_data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
