/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `bookmarks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_id_userId_key" ON "bookmarks"("id", "userId");
