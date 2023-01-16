/*
  Warnings:

  - Added the required column `avatarConfig` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "lastOnline" DATETIME,
    "password" TEXT NOT NULL,
    "avatarConfig" TEXT NOT NULL
);
INSERT INTO "new_Contact" ("createdAt", "email", "id", "lastOnline", "name", "password") SELECT "createdAt", "email", "id", "lastOnline", "name", "password" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
