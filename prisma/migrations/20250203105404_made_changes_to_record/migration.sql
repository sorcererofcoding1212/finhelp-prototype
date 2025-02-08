/*
  Warnings:

  - You are about to drop the column `holderId` on the `Record` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Record" DROP COLUMN "holderId",
ALTER COLUMN "recordHolder" DROP DEFAULT;
