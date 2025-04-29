/*
  Warnings:

  - The primary key for the `Clients` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ExerciseRoutineMap" DROP CONSTRAINT "ExerciseRoutineMap_exerciseID_fkey";

-- DropForeignKey
ALTER TABLE "ExerciseRoutineMap" DROP CONSTRAINT "ExerciseRoutineMap_routinesID_fkey";

-- DropForeignKey
ALTER TABLE "Routines" DROP CONSTRAINT "Routines_clientID_fkey";

-- AlterTable
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Clients_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Clients_id_seq";

-- AlterTable
ALTER TABLE "Routines" ALTER COLUMN "clientID" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Routines" ADD CONSTRAINT "Routines_clientID_fkey" FOREIGN KEY ("clientID") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseRoutineMap" ADD CONSTRAINT "ExerciseRoutineMap_exerciseID_fkey" FOREIGN KEY ("exerciseID") REFERENCES "Exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseRoutineMap" ADD CONSTRAINT "ExerciseRoutineMap_routinesID_fkey" FOREIGN KEY ("routinesID") REFERENCES "Routines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
