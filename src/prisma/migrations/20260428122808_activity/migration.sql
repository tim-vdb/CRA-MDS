-- Add unique constraint on Activity(clientId, date)
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_clientId_date_key" UNIQUE("clientId", "date");

-- Update Invoice table - remove foreign keys and make them nullable
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_craId_fkey";
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientId_fkey";
ALTER TABLE "Invoice" ALTER COLUMN "craId" DROP NOT NULL;
ALTER TABLE "Invoice" ALTER COLUMN "clientId" DROP NOT NULL;

-- Recreate foreign keys without onDelete CASCADE
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_craId_fkey" FOREIGN KEY ("craId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
