/*
  Warnings:

  - You are about to drop the column `defective_quantity` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `is_replacement` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `missing_quantity` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `replaces_batch_id` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `usable_quantity` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `external_batch_refs` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `batch_number` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `conversion_amount` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `expiration_date` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_code` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_name` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_unit_id` on the `order_item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "batch" DROP COLUMN "defective_quantity",
DROP COLUMN "description",
DROP COLUMN "is_replacement",
DROP COLUMN "missing_quantity",
DROP COLUMN "replaces_batch_id",
DROP COLUMN "usable_quantity",
ADD COLUMN     "need_replacement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "remarks" TEXT;

-- AlterTable
ALTER TABLE "order" DROP COLUMN "external_batch_refs";

-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "batch_number",
DROP COLUMN "conversion_amount",
DROP COLUMN "expiration_date",
DROP COLUMN "remarks",
DROP COLUMN "supplier_code",
DROP COLUMN "supplier_name",
DROP COLUMN "supplier_unit_id";

-- AlterTable
ALTER TABLE "supplier" ADD COLUMN     "contact_person" TEXT;
