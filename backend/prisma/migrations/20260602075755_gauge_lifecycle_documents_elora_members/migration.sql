/*
  Warnings:

  - Added the required column `sourceTestDate` to the `Gauge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "GaugeStatus" ADD VALUE 'Maintenance';

-- AlterTable
ALTER TABLE "Gauge" ADD COLUMN     "sourceTestDate" TEXT;
UPDATE "Gauge"
SET "sourceTestDate" = COALESCE(NULLIF("installDate", ''), "purchaseDate", CURRENT_DATE::text)
WHERE "sourceTestDate" IS NULL;
ALTER TABLE "Gauge" ALTER COLUMN "sourceTestDate" SET NOT NULL;

-- CreateTable
CREATE TABLE "GaugeDocument" (
    "id" TEXT NOT NULL,
    "gaugeId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileMimeType" TEXT NOT NULL,
    "fileDataUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GaugeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyMeterDocument" (
    "id" TEXT NOT NULL,
    "surveyMeterId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileMimeType" TEXT NOT NULL,
    "fileDataUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyMeterDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EloraMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EloraMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GaugeDocument_gaugeId_idx" ON "GaugeDocument"("gaugeId");

-- CreateIndex
CREATE INDEX "SurveyMeterDocument_surveyMeterId_idx" ON "SurveyMeterDocument"("surveyMeterId");

-- CreateIndex
CREATE UNIQUE INDEX "EloraMember_email_key" ON "EloraMember"("email");

-- AddForeignKey
ALTER TABLE "GaugeDocument" ADD CONSTRAINT "GaugeDocument_gaugeId_fkey" FOREIGN KEY ("gaugeId") REFERENCES "Gauge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyMeterDocument" ADD CONSTRAINT "SurveyMeterDocument_surveyMeterId_fkey" FOREIGN KEY ("surveyMeterId") REFERENCES "SurveyMeter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
