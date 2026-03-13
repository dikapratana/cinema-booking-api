CREATE UNIQUE INDEX "User_single_admin_role_key"
ON "User" ("role")
WHERE "role" = 'ADMIN';
