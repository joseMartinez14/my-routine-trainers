import { ExerciseRoutineMap } from '@/app/dashboard/exercises/type';

export type RoutineDay = {
  day: number;
  body_parts_string: string;
};

export type RoutineDaysStats = {
  routine_id: number;
  training_days: RoutineDay[];
  trainer_id: string;
  trainer_name: string;
  trainer_photo: string;
};

export type RoutineDayExercises = {
  name?: string;
  comment?: string;
  exercises_routine_map: ExerciseRoutineMap[];
};
