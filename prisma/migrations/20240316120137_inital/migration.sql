/*
  Warnings:

  - You are about to drop the column `upadateAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `updateAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "upadateAt",
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
