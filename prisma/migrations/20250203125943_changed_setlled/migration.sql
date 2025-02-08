/*
  Warnings:

  - You are about to drop the column `settled` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "settled",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "settled" BOOLEAN DEFAULT false;
