/*
  Warnings:

  - You are about to drop the column `userId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clientId,date]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_craId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "Invoice";

-- CreateIndex
CREATE UNIQUE INDEX "Activity_clientId_date_key" ON "Activity"("clientId", "date");

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
