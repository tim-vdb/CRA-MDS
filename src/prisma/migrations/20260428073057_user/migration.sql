-- Add userId to Clients
ALTER TABLE "Clients" ADD COLUMN "userId" TEXT;

-- Create foreign key for userId
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
