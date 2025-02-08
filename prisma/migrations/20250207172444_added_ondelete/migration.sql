-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_holderId_fkey";

-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_counterEntityId_fkey";

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_counterEntityId_fkey" FOREIGN KEY ("counterEntityId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
