import { number } from "zod";

export type AddExerciseForm = {
  name: string;
  icon: File?;
  video: File?;
};


export type bodyPart = {
  id: number;
  name: string;
}

export type ExerciseBodyPartsMap = {
  id: number;
  exerciseID: number
  bodyPartID: number
  bodyPart: bodyPart

}

export type Exercise = {
  id: number;
  name: string;
  iconLogoURL: string;
  videoURL: string;
  trainerID: string;
  ExerciseBodyPartsMap: ExerciseBodyPartsMap[];

}

export type ExerciseRoutineMap = {
  id: number;
  exerciseID: number;
  routineID: number;
  day: number;
  reps: string;
  variation: string?;
  weight: string?;
  exercise: Exercise;
}

export type Rotine = {
  id: number;
  name: string?;
  ExerciseRoutineMap: ExerciseRoutineMap[];
  createdAt: Date;
}


