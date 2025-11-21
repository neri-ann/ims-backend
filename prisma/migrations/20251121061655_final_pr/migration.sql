/*
  Warnings:

  - You are about to drop the column `disposal_status` on the `disposal` table. All the data in the column will be lost.
  - You are about to drop the column `contact_person` on the `supplier` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "disposal_disposal_status_is_deleted_idx";

-- AlterTable
ALTER TABLE "disposal" DROP COLUMN "disposal_status";

-- AlterTable
ALTER TABLE "supplier" DROP COLUMN "contact_person";

-- DropEnum
DROP TYPE "disposal_status";
