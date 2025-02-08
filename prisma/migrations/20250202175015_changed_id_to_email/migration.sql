-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_holderId_fkey";

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
