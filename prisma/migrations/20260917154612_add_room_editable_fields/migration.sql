-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "capacityAdults" INTEGER NOT NULL,
    "capacityChildren" INTEGER NOT NULL,
    "bedType" TEXT NOT NULL,
    "sizeSqm" INTEGER NOT NULL,
    "basePriceThb" INTEGER NOT NULL,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,
    "features" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Room" ("basePriceThb", "bedType", "capacityAdults", "capacityChildren", "createdAt", "description", "id", "name", "roomType", "sizeSqm", "slug", "sortOrder", "status", "updatedAt") SELECT "basePriceThb", "bedType", "capacityAdults", "capacityChildren", "createdAt", "description", "id", "name", "roomType", "sizeSqm", "slug", "sortOrder", "status", "updatedAt" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_slug_key" ON "Room"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
