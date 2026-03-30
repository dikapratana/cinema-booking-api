UPDATE "Seat"
SET
  "rowLabel" = UPPER(SUBSTRING("number" FROM '^([A-Za-z]+)')),
  "columnNumber" = CAST(SUBSTRING("number" FROM '([0-9]+)$') AS INTEGER)
WHERE "rowLabel" IS NULL OR "columnNumber" IS NULL;

ALTER TABLE "Seat"
ALTER COLUMN "rowLabel" SET NOT NULL,
ALTER COLUMN "columnNumber" SET NOT NULL;
