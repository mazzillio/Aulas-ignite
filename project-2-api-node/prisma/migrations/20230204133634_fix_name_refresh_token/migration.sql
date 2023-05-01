/*
  Warnings:

  - You are about to drop the column `refreseh_token` on the `UsersTokens` table. All the data in the column will be lost.
  - Added the required column `refresh_token` to the `UsersTokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersTokens" DROP COLUMN "refreseh_token",
ADD COLUMN     "refresh_token" TEXT NOT NULL;
