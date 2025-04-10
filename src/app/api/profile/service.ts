import { prisma } from '@/lib/prisma';

export const update_profile = async (
  trainer_id: string,
  name: string,
  phone: string,
  aboutMe: string,
  iconURL: string | null
) => {
  try {
    // 2. Add new body parts (Recreate associations)
    const profile = await prisma.trainers.update({
      where: { id: trainer_id },
      data: {
        name: name,
        phone: phone,
        aboutMe: aboutMe,
        photoURL: iconURL,
      },
    });

    return profile;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const get_trainer_profile = async (trainer_id: string) => {
  try {
    // 2. Add new body parts (Recreate associations)
    const profile = await prisma.trainers.findUniqueOrThrow({
      where: { id: trainer_id },
    });

    return profile;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
