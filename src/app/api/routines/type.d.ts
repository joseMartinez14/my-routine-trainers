export type ClientRoutineStat = {
  routine_id: number;
  routine_created_time: string;
  routine_name: string?;
  day_amount: number;
  avg_day_exercises: number;
};

export type RoutinesStat = {
  routine_id: number;
  client_id: number;
  client_name: string;
  routine_created_time: string;
  routine_name: string?;
  day_amount: number;
  avg_day_exercises: number;
};

