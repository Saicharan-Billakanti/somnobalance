CREATE TABLE IF NOT EXISTS "SubmissionLimit" (
  "key" TEXT PRIMARY KEY,
  "count" INTEGER NOT NULL,
  "expiresAt" INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_submission_expiry" ON "SubmissionLimit"("expiresAt");

-- A request is NOT evidence of confirmed subscription. Confirmation lives in Brevo.
CREATE TABLE IF NOT EXISTS "NewsletterConsentRequest" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL,
  "source" TEXT NOT NULL CHECK ("source" IN ('footer', 'regeneration-check')),
  "consentVersion" TEXT NOT NULL,
  "submittedAt" TEXT NOT NULL,
  "status" TEXT NOT NULL CHECK ("status" IN ('requested', 'provider_accepted', 'provider_rejected', 'provider_unknown', 'duplicate'))
);
CREATE INDEX IF NOT EXISTS "idx_newsletter_submitted" ON "NewsletterConsentRequest"("submittedAt");
