/*
  Warnings:

  - The values [TO_BE_REFUNDED,TO_BE_REPLACED] on the enum `order_status` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `stock` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "stock_status" AS ENUM ('INACTIVE', 'AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'NOT_AVAILABLE', 'UNDER_MAINTENANCE', 'EXPIRED', 'IN_USE', 'DISPOSED');

-- CreateEnum
CREATE TYPE "order_item_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'PARTIALLY_COMPLETED', 'TO_BE_REFUNDED', 'TO_BE_REPLACED', 'REFUNDED', 'REPLACED', 'WRITE_OFF', 'CLOSED');

-- CreateEnum
CREATE TYPE "replacement_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'PARTIALLY_COMPLETED', 'TO_BE_REFUNDED', 'TO_BE_REPLACED', 'REFUNDED', 'REPLACED', 'WRITE_OFF', 'CLOSED');

-- AlterEnum
BEGIN;
CREATE TYPE "order_status_new" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'PARTIALLY_COMPLETED', 'PROCESSING_REFUND', 'PROCESSING_REPLACEMENT', 'PROCESSING_REFUND_AND_REPLACEMENT', 'REFUNDED', 'REPLACED', 'REFUNDED_AND_REPLACED', 'WRITE_OFF', 'CLOSED');
ALTER TABLE "public"."order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "order" ALTER COLUMN "status" TYPE "order_status_new" USING ("status"::text::"order_status_new");
ALTER TYPE "order_status" RENAME TO "order_status_old";
ALTER TYPE "order_status_new" RENAME TO "order_status";
DROP TYPE "public"."order_status_old";
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "batch" ADD COLUMN     "is_replacement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "original_batch_id" INTEGER,
ADD COLUMN     "replacement_date" TIMESTAMP(3),
ADD COLUMN     "replacement_status" "replacement_status",
ADD COLUMN     "replaces_batch_id" INTEGER;

-- AlterTable
ALTER TABLE "order_item" ADD COLUMN     "conversion_amount" DECIMAL(12,4),
ADD COLUMN     "order_item_status" "order_item_status" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "supplier_code" TEXT,
ADD COLUMN     "supplier_item_ref" TEXT,
ADD COLUMN     "supplier_name" TEXT,
ADD COLUMN     "supplier_unit_id" TEXT;

-- AlterTable
ALTER TABLE "stock" DROP COLUMN "status",
ADD COLUMN     "status" "stock_status" NOT NULL DEFAULT 'INACTIVE';

-- AlterTable
ALTER TABLE "supplier_item" ADD COLUMN     "last_purchase_date" TIMESTAMP(3),
ADD COLUMN     "last_purchase_price" DECIMAL(12,2);

-- DropEnum
DROP TYPE "inventory_status";

-- CreateIndex
CREATE INDEX "order_item_order_item_status_idx" ON "order_item"("order_item_status");

-- CreateIndex
CREATE INDEX "stock_status_is_deleted_idx" ON "stock"("status", "is_deleted");

-- CreateIndex
CREATE INDEX "supplier_item_last_purchase_date_idx" ON "supplier_item"("last_purchase_date");
