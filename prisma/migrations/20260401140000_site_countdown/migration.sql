CREATE TABLE "azure_site_countdown" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "target_iso" TEXT NOT NULL,
    "countdown_enabled" INTEGER NOT NULL DEFAULT 1,
    "updated_at" DATETIME NOT NULL
);

INSERT INTO "azure_site_countdown" ("id", "target_iso", "countdown_enabled", "updated_at")
VALUES ('default', '2026-03-15T12:00:00', 1, CURRENT_TIMESTAMP);
