-- AlterTable
ALTER TABLE "Option" DROP COLUMN "takeoutAvailable",
ADD COLUMN     "giftAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "frozenDelivery" BOOLEAN NOT NULL DEFAULT false;
