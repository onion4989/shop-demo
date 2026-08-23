-- AlterTable
ALTER TABLE "Option" ADD COLUMN "shippingAvailable" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Option" ADD COLUMN "reservationRequired" BOOLEAN NOT NULL DEFAULT false;
