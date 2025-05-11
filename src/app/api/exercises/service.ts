import { prisma } from '@/lib/prisma';

export const create_new_exercise = async (
  trainer_id: string,
  name: string,
  iconURL: string | null,
  videoURL: string | null,
  bodyParts: number[] | []
) => {
  try {
    const new_exercise = await prisma.exercises.create({
      data: {
        trainerID: trainer_id,
        name: name,
        iconLogoURL: iconURL,
        videoURL: videoURL,
        ExerciseBodyPartsMap: {
          create: bodyParts.map((bp) => ({
            bodyPart: { connect: { id: bp } }, // Connect existing body part
          })),
        },
      },
      include: { ExerciseBodyPartsMap: true },
    });

    return Response.json(new_exercise);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const get_trainer_exercises = async (trainer_id: string) => {
  const exercises = await prisma.exercises.findMany({
    where: {
      trainerID: trainer_id,
    },
    include: {
      ExerciseBodyPartsMap: {
        include: { bodyPart: true },
      },
    },
  });

  return exercises;
};

export const get_one_exercise = async (trainer_id: string, exercise_id: string) => {
  const exercise = await prisma.exercises.findUniqueOrThrow({
    where: {
      id: Number(exercise_id),
    },
    include: {
      ExerciseBodyPartsMap: {
        include: { bodyPart: true },
      },
    },
  });

  return exercise;
};

export const delete_exercise = async (exercise_id: string) => {
  await prisma.exercises.delete({
    where: {
      id: Number(exercise_id),
    },
  });

  return true;
};

export const update_exercise = async (
  trainer_id: string,
  exercises_id: number,
  name: string,
  iconURL: string | null,
  videoURL: string | null,
  bodyParts: number[] | []
) => {
  try {
    // 1. Remove existing associations (Disconnect all)
    await prisma.exerciseBodyPartsMap.deleteMany({
      where: { exerciseID: exercises_id },
    });

    // 2. Add new body parts (Recreate associations)
    const exercise = await prisma.exercises.update({
      where: { id: exercises_id },
      data: {
        name: name,
        iconLogoURL: iconURL,
        videoURL: videoURL,
        ExerciseBodyPartsMap: {
          create: bodyParts.map((bodyPartID) => ({
            bodyPart: { connect: { id: bodyPartID } },
          })),
        },
      },
    });

    return Response.json(exercise);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
