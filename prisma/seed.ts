import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insert default users
  await prisma.bodyParts.createMany({
    data: [
      { name: 'Pecho' },
      { name: 'Pectorales' },
      { name: 'Espalda' },
      { name: 'Dorsales' },
      { name: 'Trapecio' },
      { name: 'Hombros' },
      { name: 'Deltoides' },
      { name: 'Brazos' },
      { name: 'Bíceps' },
      { name: 'Tríceps' },
      { name: 'Piernas' },
      { name: 'Cuádriceps' },
      { name: 'Isquiotibiales' },
      { name: 'Glúteos' },
      { name: 'Gemelos' },
      { name: 'Núcleo' },
      { name: 'Abdominales' },
      { name: 'Lumbar' },
      { name: 'Gastronecmio' },
    ],
    skipDuplicates: true, // Avoid errors if the users already exist
  });

  console.log('Default users inserted!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
