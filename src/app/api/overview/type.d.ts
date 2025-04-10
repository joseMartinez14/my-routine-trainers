import { RoutinesStat } from '../routines/type';

export type OverviewStats = {
  top_routines: RoutinesStat[];
  count_active_routines: number;
  count_clients: number;
  count_exercises: number;
};
