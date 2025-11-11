/*
  Warnings:

  - You are about to drop the `Checkin` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EngagementType" AS ENUM ('CHECKIN', 'INDICATION_SENT', 'INDICATION_RECEIVED', 'NOTICE_READ');

-- DropForeignKey
ALTER TABLE "Checkin" DROP CONSTRAINT "Checkin_memberId_fkey";

-- DropTable
DROP TABLE "Checkin";

-- CreateTable
CREATE TABLE "Engagement" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" "EngagementType" NOT NULL DEFAULT 'CHECKIN',
    "meetingId" INTEGER,
    "relatedId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
