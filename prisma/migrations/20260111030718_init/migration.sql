-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_category_id_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_unit_id_fkey";

-- AlterTable
ALTER TABLE "item" ALTER COLUMN "category_id" DROP NOT NULL,
ALTER COLUMN "unit_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit_measure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
