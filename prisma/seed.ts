import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insert default users
  await prisma.bodyParts.createMany({
    data: [
      { name: 'Chest' },
      { name: 'Pectorals' },
      { name: 'Back' },
      { name: 'Lats' },
      { name: 'Trapezius' },
      { name: 'Shoulders' },
      { name: 'Deltoids' },
      { name: 'Arms' },
      { name: 'Biceps' },
      { name: 'Triceps' },
      { name: 'Legs' },
      { name: 'Quadriceps' },
      { name: 'Hamstrings' },
      { name: 'Glutes' },
      { name: 'Calves' },
      { name: 'Core' },
      { name: 'Abdominals' },
      { name: 'Lower Back' },
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
