-- DropForeignKey
ALTER TABLE "Engagement" DROP CONSTRAINT "Engagement_memberId_fkey";

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
