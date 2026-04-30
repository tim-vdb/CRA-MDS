/*
  Warnings:

  - A unique constraint covering the columns `[userId,siret]` on the table `Clients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,email]` on the table `Clients` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Clients` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_userId_fkey";

-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Clients_userId_idx" ON "Clients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_userId_siret_key" ON "Clients"("userId", "siret");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_userId_email_key" ON "Clients"("userId", "email");

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
