import { count } from 'console';

import { prisma } from '@/lib/prisma';

import { get_trainer_routines } from '../routines/service';
import { RoutinesStat } from '../routines/type';
import { OverviewStats } from './type';

export const get_overview_stats = async (trainer_uid: string) => {
  try {
    const routines: RoutinesStat[] = await get_trainer_routines(trainer_uid);

    const counts = await prisma.trainers.findUnique({
      where: {
        id: trainer_uid,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            clients: true,
            Exercise: true,
          },
        },
      },
    });

    const return_data: OverviewStats = {
      top_routines: routines,
      count_active_routines: routines.length,
      count_clients: counts?._count.clients || 0,
      count_exercises: counts?._count.Exercise || 0,
    };

    return return_data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
