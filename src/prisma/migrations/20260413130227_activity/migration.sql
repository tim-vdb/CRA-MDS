/*
  Warnings:

  - You are about to drop the `CRA` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CRA" DROP CONSTRAINT "CRA_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_craId_fkey";

-- DropTable
DROP TABLE "CRA";

-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "daysWorked" DOUBLE PRECISION NOT NULL,
    "hoursWorked" DOUBLE PRECISION,
    "description" TEXT,
    "validatedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_clientId_idx" ON "activity"("clientId");

-- CreateIndex
CREATE INDEX "activity_month_year_idx" ON "activity"("month", "year");

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_craId_fkey" FOREIGN KEY ("craId") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
