-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('Present', 'Absent', 'Leave', 'Resigned');

-- CreateEnum
CREATE TYPE "GaugeStatus" AS ENUM ('Active', 'Inactive', 'Disposed');

-- CreateEnum
CREATE TYPE "SurveyMeterStatus" AS ENUM ('Working', 'Not_Working');

-- CreateEnum
CREATE TYPE "RsoStatus" AS ENUM ('Valid', 'Expired');

-- CreateEnum
CREATE TYPE "MeetingActionStatus" AS ENUM ('Pending', 'In_Progress', 'Completed');

-- CreateTable
CREATE TABLE "Gauge" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "activity" TEXT NOT NULL,
    "purchaseDate" TEXT NOT NULL,
    "installDate" TEXT,
    "life" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "plant" TEXT NOT NULL,
    "nocNumber" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "calibrationDueDate" TEXT NOT NULL,
    "status" "GaugeStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gauge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyMeter" (
    "id" TEXT NOT NULL,
    "surveyMeterName" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "dateOfProcurement" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "detectorType" TEXT NOT NULL,
    "detectorVolume" TEXT NOT NULL,
    "radiationType" TEXT NOT NULL,
    "functionalStatus" "SurveyMeterStatus" NOT NULL DEFAULT 'Working',
    "calibrationDate" TEXT NOT NULL,
    "calibrationTillDate" TEXT NOT NULL,
    "calibrationLab" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveyMeter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RsoPersonnel" (
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "caseFileNumber" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "dateOfIssue" TEXT NOT NULL,
    "validTill" TEXT NOT NULL,
    "status" "RsoStatus" NOT NULL DEFAULT 'Valid',
    "certificateName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RsoPersonnel_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "timeLabel" TEXT,
    "chairPerson" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingTopic" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeetingTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussionPoint" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "point" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussionPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingParticipant" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "personnelId" TEXT,
    "participantSource" TEXT NOT NULL DEFAULT 'external',
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'certified_rso',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeetingParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'Present',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionItem" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "serialNo" INTEGER NOT NULL,
    "task" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "status" "MeetingActionStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gauge_serialNumber_key" ON "Gauge"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyMeter_serialNumber_key" ON "SurveyMeter"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RsoPersonnel_email_key" ON "RsoPersonnel"("email");

-- CreateIndex
CREATE INDEX "MeetingTopic_meetingId_idx" ON "MeetingTopic"("meetingId");

-- CreateIndex
CREATE INDEX "DiscussionPoint_meetingId_idx" ON "DiscussionPoint"("meetingId");

-- CreateIndex
CREATE INDEX "MeetingParticipant_meetingId_idx" ON "MeetingParticipant"("meetingId");

-- CreateIndex
CREATE INDEX "MeetingParticipant_personnelId_idx" ON "MeetingParticipant"("personnelId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_participantId_key" ON "Attendance"("participantId");

-- CreateIndex
CREATE INDEX "ActionItem_meetingId_idx" ON "ActionItem"("meetingId");

-- AddForeignKey
ALTER TABLE "MeetingTopic" ADD CONSTRAINT "MeetingTopic_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionPoint" ADD CONSTRAINT "DiscussionPoint_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingParticipant" ADD CONSTRAINT "MeetingParticipant_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingParticipant" ADD CONSTRAINT "MeetingParticipant_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "RsoPersonnel"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "MeetingParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionItem" ADD CONSTRAINT "ActionItem_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
