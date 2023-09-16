/*
  Warnings:

  - Added the required column `written_at` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "written_at" TIMESTAMP(3) NOT NULL;
