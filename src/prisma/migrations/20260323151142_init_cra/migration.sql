/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Gallery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `newsletter` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE');

-- DropForeignKey
ALTER TABLE "blog" DROP CONSTRAINT "blog_authorId_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "registration" DROP CONSTRAINT "registration_eventId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role";

-- DropTable
DROP TABLE "Gallery";

-- DropTable
DROP TABLE "blog";

-- DropTable
DROP TABLE "event";

-- DropTable
DROP TABLE "newsletter";

-- DropEnum
DROP TYPE "GalleryType";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "address" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "country" TEXT DEFAULT 'France',
    "siret" TEXT,
    "vatNumber" TEXT,
    "dailyRate" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CRA" (
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

    CONSTRAINT "CRA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_invite" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "craId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "amountHT" DOUBLE PRECISION NOT NULL,
    "amountTTC" DOUBLE PRECISION NOT NULL,
    "tvaRate" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "tvaAmount" DOUBLE PRECISION NOT NULL,
    "status" "InvoiceStatus" NOT NULL,
    "number" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clients_email_key" ON "Clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_siret_key" ON "Clients"("siret");

-- CreateIndex
CREATE INDEX "Clients_name_idx" ON "Clients"("name");

-- CreateIndex
CREATE INDEX "Clients_company_idx" ON "Clients"("company");

-- CreateIndex
CREATE INDEX "CRA_clientId_idx" ON "CRA"("clientId");

-- CreateIndex
CREATE INDEX "CRA_month_year_idx" ON "CRA"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "client_invite_token_key" ON "client_invite"("token");

-- CreateIndex
CREATE INDEX "client_invite_token_idx" ON "client_invite"("token");

-- CreateIndex
CREATE INDEX "client_invite_clientId_idx" ON "client_invite"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");

-- CreateIndex
CREATE INDEX "Invoice_clientId_issuedAt_idx" ON "Invoice"("clientId", "issuedAt");

-- AddForeignKey
ALTER TABLE "CRA" ADD CONSTRAINT "CRA_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_invite" ADD CONSTRAINT "client_invite_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_craId_fkey" FOREIGN KEY ("craId") REFERENCES "CRA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
