-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "lastOnline" DATETIME,
    "password" TEXT NOT NULL,
    "photoUrl" TEXT
);
INSERT INTO "new_User" ("createdAt", "email", "id", "lastOnline", "name", "password", "photoUrl") SELECT "createdAt", "email", "id", "lastOnline", "name", "password", "photoUrl" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
