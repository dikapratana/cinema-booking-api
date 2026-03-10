/*
  Warnings:

  - A unique constraint covering the columns `[cinemaId,name]` on the table `Studio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Studio_cinemaId_name_key" ON "Studio"("cinemaId", "name");
