CREATE TABLE "azure_portal_allowed_emails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email_norm" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "azure_portal_allowed_emails_email_norm_key" ON "azure_portal_allowed_emails"("email_norm");

CREATE TABLE "azure_portal_otp_challenges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email_norm" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "salt_b64" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "azure_portal_otp_challenges_email_norm_idx" ON "azure_portal_otp_challenges"("email_norm");

CREATE TABLE "azure_portal_auth_request_log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email_key" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "azure_portal_auth_request_log_email_key_created_at_idx" ON "azure_portal_auth_request_log"("email_key", "created_at");
