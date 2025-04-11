-- CreateTable
CREATE TABLE "Clients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "anatomy" TEXT,
    "injuries" TEXT,
    "objective" TEXT,
    "experience" TEXT,
    "weeklyTrainingDays" INTEGER NOT NULL,
    "trainingMinutes" INTEGER NOT NULL,
    "trainersId" TEXT NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trainers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL,
    "photoURL" TEXT NOT NULL,

    CONSTRAINT "Trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routines" (
    "id" SERIAL NOT NULL,
    "clientID" INTEGER NOT NULL,
    "trainerID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,

    CONSTRAINT "Routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercises" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trainerID" TEXT NOT NULL,
    "iconLogoURL" TEXT,
    "videoURL" TEXT,

    CONSTRAINT "Exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseRoutineMap" (
    "id" SERIAL NOT NULL,
    "exerciseID" INTEGER NOT NULL,
    "routinesID" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "reps" TEXT NOT NULL,
    "variation" TEXT,
    "weight" TEXT,

    CONSTRAINT "ExerciseRoutineMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseBodyPartsMap" (
    "id" SERIAL NOT NULL,
    "exerciseID" INTEGER NOT NULL,
    "bodyPartID" INTEGER NOT NULL,

    CONSTRAINT "ExerciseBodyPartsMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyParts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BodyParts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_trainersId_fkey" FOREIGN KEY ("trainersId") REFERENCES "Trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routines" ADD CONSTRAINT "Routines_clientID_fkey" FOREIGN KEY ("clientID") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routines" ADD CONSTRAINT "Routines_trainerID_fkey" FOREIGN KEY ("trainerID") REFERENCES "Trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_trainerID_fkey" FOREIGN KEY ("trainerID") REFERENCES "Trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseRoutineMap" ADD CONSTRAINT "ExerciseRoutineMap_exerciseID_fkey" FOREIGN KEY ("exerciseID") REFERENCES "Exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseRoutineMap" ADD CONSTRAINT "ExerciseRoutineMap_routinesID_fkey" FOREIGN KEY ("routinesID") REFERENCES "Routines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseBodyPartsMap" ADD CONSTRAINT "ExerciseBodyPartsMap_exerciseID_fkey" FOREIGN KEY ("exerciseID") REFERENCES "Exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseBodyPartsMap" ADD CONSTRAINT "ExerciseBodyPartsMap_bodyPartID_fkey" FOREIGN KEY ("bodyPartID") REFERENCES "BodyParts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
