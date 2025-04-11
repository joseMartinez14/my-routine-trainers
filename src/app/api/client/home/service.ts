import { prisma } from '@/lib/prisma';

import { RoutineDay, RoutineDayExercises, RoutineDaysStats } from './type';

export const get_home_routine = async (client_id: number, trainer_id: string) => {
  try {
    const routine = await prisma.routines.findFirst({
      where: {
        clientID: client_id,
        trainerID: trainer_id,
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
      orderBy: [{ createdAt: 'desc' }],
    });

    //I need to take the details here.

    const stats_dict: { [key: number]: Set<string> } = {};

    routine?.ExerciseRoutineMap.forEach((exercise_rutine_map) => {
      exercise_rutine_map.exercise.ExerciseBodyPartsMap.forEach((exercise_bp_map) => {
        if (!stats_dict[exercise_rutine_map.day]) {
          stats_dict[exercise_rutine_map.day] = new Set<string>();
        }
        stats_dict[exercise_rutine_map.day].add(exercise_bp_map.bodyPart.name);
      });
    });

    const routine_days_list: RoutineDay[] = [];
    for (const key in stats_dict) {
      const bp_list = Array.from(stats_dict[key]);
      routine_days_list.push({ day: Number(key), body_parts_string: bp_list.join(', ') });
    }

    const return_data: RoutineDaysStats = {
      routine_id: routine?.id || -1,
      training_days: routine_days_list,
      trainer_id: routine?.trainer.id || '',
      trainer_name: routine?.trainer.name || '',
      trainer_photo: routine?.trainer.photoURL || '',
    };

    return return_data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
