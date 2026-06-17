-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "fileName" TEXT,
    "filePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
