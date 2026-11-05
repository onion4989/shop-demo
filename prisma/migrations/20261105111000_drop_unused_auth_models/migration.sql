-- Drop unused auth leftovers only.
-- Product / Category / Option / ProductImage / NutritionalInfo are intentionally untouched.
-- IF EXISTS keeps deploy safe when some environments never created these tables.

DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "TwoFactorConfirmation" CASCADE;
DROP TABLE IF EXISTS "TwoFactorConfimation" CASCADE;
DROP TABLE IF EXISTS "TwoFactorToken" CASCADE;
DROP TABLE IF EXISTS "PasswordResetToken" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
DROP TABLE IF EXISTS "BackupCode" CASCADE;
DROP TABLE IF EXISTS "LoginAttempt" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TYPE IF EXISTS "UserRole";
