export type AddClientForm = {
  name: string;
  phone: string;
  anatomy: string?;
  injuries: string?;
  objective: string?;
  experience: string?;
  weeklyTrainingDays: number;
  trainingMinutes: number;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  anatomy: string?;
  injuries: string?;
  objective: string?;
  experience: string?;
  weeklyTrainingDays: number;
  trainingMinutes: number;
};


export type AddRoutineExercise = {
  name: string?;
  exerciseID: number;
  trainingDay: number;
  reps: string;
  variation: string?;
  weight: string?;
};

