-- CreateTable
CREATE TABLE "TrainingManual" (
    "id" TEXT NOT NULL,
    "manualName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "fileName" TEXT,
    "filePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingManual_pkey" PRIMARY KEY ("id")
);
