/*
  Warnings:

  - You are about to drop the column `metadata` on the `Engagement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Engagement" DROP CONSTRAINT "Engagement_memberId_fkey";

-- AlterTable
ALTER TABLE "Engagement" DROP COLUMN "metadata";

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
