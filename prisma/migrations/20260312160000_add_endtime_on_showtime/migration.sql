-- AlterTable
ALTER TABLE "Showtime" ADD COLUMN "endTime" TIMESTAMP(3);

-- Backfill existing rows from movie duration
UPDATE "Showtime" AS s
SET "endTime" = s."startTime" + make_interval(mins => m."duration")
FROM "Movie" AS m
WHERE s."movieId" = m."id"
  AND s."endTime" IS NULL;

-- Enforce required column after backfill
ALTER TABLE "Showtime" ALTER COLUMN "endTime" SET NOT NULL;
