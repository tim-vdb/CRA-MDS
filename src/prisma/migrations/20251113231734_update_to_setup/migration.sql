/*
  Warnings:

  - Made the column `title` on table `blog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "blog" ALTER COLUMN "title" SET NOT NULL;
