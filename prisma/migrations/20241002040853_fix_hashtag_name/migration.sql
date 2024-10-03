/*
  Warnings:

  - You are about to drop the column `hastag` on the `Trend` table. All the data in the column will be lost.
  - Added the required column `hashtag` to the `Trend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trend" DROP COLUMN "hastag",
ADD COLUMN     "hashtag" TEXT NOT NULL;
