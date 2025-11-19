/*
  Warnings:

  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Batch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BodyBuilder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BrandNewDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dealer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Disposal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Manufacturer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SecondHandDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupplierItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnitMeasure` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "item_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "inventory_status" AS ENUM ('INACTIVE', 'AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'NOT_AVAILABLE', 'UNDER_MAINTENANCE', 'EXPIRED', 'IN_USE', 'DISPOSED');

-- CreateEnum
CREATE TYPE "bus_status" AS ENUM ('ACTIVE', 'DECOMMISSIONED', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "bus_type" AS ENUM ('AIRCONDITIONED', 'ORDINARY');

-- CreateEnum
CREATE TYPE "bus_condition" AS ENUM ('BRAND_NEW', 'SECOND_HAND');

-- CreateEnum
CREATE TYPE "bus_source" AS ENUM ('DEALERSHIP', 'AUCTION', 'PRIVATE_INDIVIDUAL', 'COMPANY_FLEET');

-- CreateEnum
CREATE TYPE "acquisition_method" AS ENUM ('PURCHASED', 'LEASED', 'DONATED');

-- CreateEnum
CREATE TYPE "registration_status" AS ENUM ('REGISTERED', 'NOT_REGISTERED', 'NEEDS_RENEWAL', 'EXPIRED');

-- CreateEnum
CREATE TYPE "disposal_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "disposal_method" AS ENUM ('SOLD', 'SCRAPPED', 'DONATED', 'TRANSFERRED', 'WRITTEN_OFF');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'PARTIALLY_COMPLETED', 'TO_BE_REFUNDED', 'TO_BE_REPLACED', 'CLOSED');

-- DropForeignKey
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_stockId_fkey";

-- DropForeignKey
ALTER TABLE "BrandNewDetails" DROP CONSTRAINT "BrandNewDetails_busId_fkey";

-- DropForeignKey
ALTER TABLE "BrandNewDetails" DROP CONSTRAINT "BrandNewDetails_dealerId_fkey";

-- DropForeignKey
ALTER TABLE "Bus" DROP CONSTRAINT "Bus_bodyBuilderId_fkey";

-- DropForeignKey
ALTER TABLE "Bus" DROP CONSTRAINT "Bus_manufacturerId_fkey";

-- DropForeignKey
ALTER TABLE "Bus" DROP CONSTRAINT "Bus_stockId_fkey";

-- DropForeignKey
ALTER TABLE "Disposal" DROP CONSTRAINT "Disposal_batchId_fkey";

-- DropForeignKey
ALTER TABLE "Disposal" DROP CONSTRAINT "Disposal_busId_fkey";

-- DropForeignKey
ALTER TABLE "Disposal" DROP CONSTRAINT "Disposal_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Disposal" DROP CONSTRAINT "Disposal_stockId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_unitId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "SecondHandDetails" DROP CONSTRAINT "SecondHandDetails_busId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_itemId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierItem" DROP CONSTRAINT "SupplierItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierItem" DROP CONSTRAINT "SupplierItem_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierItem" DROP CONSTRAINT "SupplierItem_supplierUnitId_fkey";

-- DropTable
DROP TABLE "Attachment";

-- DropTable
DROP TABLE "Batch";

-- DropTable
DROP TABLE "BodyBuilder";

-- DropTable
DROP TABLE "BrandNewDetails";

-- DropTable
DROP TABLE "Bus";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Dealer";

-- DropTable
DROP TABLE "Disposal";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "Manufacturer";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "SecondHandDetails";

-- DropTable
DROP TABLE "Stock";

-- DropTable
DROP TABLE "Supplier";

-- DropTable
DROP TABLE "SupplierItem";

-- DropTable
DROP TABLE "UnitMeasure";

-- DropEnum
DROP TYPE "AcquisitionMethod";

-- DropEnum
DROP TYPE "BusCondition";

-- DropEnum
DROP TYPE "BusSource";

-- DropEnum
DROP TYPE "BusStatus";

-- DropEnum
DROP TYPE "BusType";

-- DropEnum
DROP TYPE "DisposalMethod";

-- DropEnum
DROP TYPE "DisposalStatus";

-- DropEnum
DROP TYPE "InventoryStatus";

-- DropEnum
DROP TYPE "ItemStatus";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "RegistrationStatus";

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "category_code" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "description" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_measure" (
    "id" SERIAL NOT NULL,
    "unit_code" TEXT NOT NULL,
    "unit_name" TEXT NOT NULL,
    "abbreviation" TEXT,
    "description" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "unit_measure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "item_code" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "status" "item_status" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier" (
    "id" SERIAL NOT NULL,
    "supplier_code" TEXT NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "contact_number" TEXT,
    "email" TEXT,
    "street" TEXT,
    "barangay" TEXT,
    "city" TEXT,
    "province" TEXT,
    "status" "item_status" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_item" (
    "supplier_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "supplier_unit_id" INTEGER NOT NULL,
    "conversion_amount" DECIMAL(12,4) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "stock" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "current_stock" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "reorder_level" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "inventory_status" NOT NULL DEFAULT 'INACTIVE',
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "batch_number" TEXT,
    "usable_quantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "defective_quantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "missing_quantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "expiration_date" TIMESTAMP(3),
    "received_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "external_order_ref" TEXT,
    "purchase_request_ref" TEXT,

    CONSTRAINT "batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "body_builder" (
    "id" SERIAL NOT NULL,
    "body_builder_code" TEXT NOT NULL,
    "body_builder_name" TEXT NOT NULL,
    "description" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "body_builder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturer" (
    "id" SERIAL NOT NULL,
    "manufacturer_code" TEXT NOT NULL,
    "manufacturer_name" TEXT NOT NULL,
    "description" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bus" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER,
    "plate_number" TEXT NOT NULL,
    "body_number" TEXT NOT NULL,
    "body_builder_id" INTEGER NOT NULL,
    "bus_type" "bus_type" NOT NULL,
    "manufacturer_id" INTEGER NOT NULL,
    "status" "bus_status" NOT NULL DEFAULT 'ACTIVE',
    "chassis_number" TEXT,
    "engine_number" TEXT,
    "seat_capacity" INTEGER,
    "model" TEXT,
    "year_model" INTEGER,
    "condition" "bus_condition" NOT NULL,
    "acquisition_date" TIMESTAMP(3),
    "acquisition_method" "acquisition_method" NOT NULL,
    "warranty_expiration_date" TIMESTAMP(3),
    "registration_status" "registration_status",
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "bus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "second_hand_details" (
    "id" SERIAL NOT NULL,
    "bus_id" INTEGER NOT NULL,
    "previous_owner" TEXT,
    "previous_owner_contact" TEXT,
    "source" "bus_source" NOT NULL,
    "odometer_reading" DECIMAL(12,2),
    "last_registration_date" TIMESTAMP(3),
    "description" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "second_hand_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_new_details" (
    "id" SERIAL NOT NULL,
    "bus_id" INTEGER NOT NULL,
    "dealer_name" TEXT,
    "dealer_contact" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "brand_new_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disposal" (
    "id" SERIAL NOT NULL,
    "disposal_code" TEXT NOT NULL,
    "item_id" INTEGER,
    "bus_id" INTEGER,
    "batch_id" INTEGER,
    "stock_id" INTEGER,
    "quantity" DECIMAL(12,2),
    "disposal_date" TIMESTAMP(3) NOT NULL,
    "disposal_method" "disposal_method" NOT NULL,
    "description" TEXT,
    "estimated_value" DECIMAL(12,2),
    "actual_value" DECIMAL(12,2),
    "disposal_status" "disposal_status" NOT NULL DEFAULT 'PENDING',
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "rejected_by" TEXT,
    "rejected_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "disposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "order_code" TEXT NOT NULL,
    "purchase_request_ref" TEXT NOT NULL,
    "status" "order_status" NOT NULL DEFAULT 'PENDING',
    "external_batch_refs" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "closed_by" TEXT,
    "closed_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "external_item_ref" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "ordered_quantity" DECIMAL(12,2) NOT NULL,
    "ordered_unit_price" DECIMAL(12,2) NOT NULL,
    "ordered_total_price" DECIMAL(12,2) NOT NULL,
    "received_quantity" DECIMAL(12,2) DEFAULT 0,
    "actual_unit_price" DECIMAL(12,2),
    "actual_total_price" DECIMAL(12,2),
    "missing_quantity" DECIMAL(12,2) DEFAULT 0,
    "damaged_quantity" DECIMAL(12,2) DEFAULT 0,
    "batch_number" TEXT,
    "expiration_date" TIMESTAMP(3),
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachment" (
    "id" SERIAL NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "description" TEXT,
    "uploaded_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_category_code_key" ON "category"("category_code");

-- CreateIndex
CREATE INDEX "category_category_code_idx" ON "category"("category_code");

-- CreateIndex
CREATE INDEX "category_is_deleted_idx" ON "category"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "unit_measure_unit_code_key" ON "unit_measure"("unit_code");

-- CreateIndex
CREATE INDEX "unit_measure_unit_code_idx" ON "unit_measure"("unit_code");

-- CreateIndex
CREATE INDEX "unit_measure_is_deleted_idx" ON "unit_measure"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "item_item_code_key" ON "item"("item_code");

-- CreateIndex
CREATE INDEX "item_item_code_idx" ON "item"("item_code");

-- CreateIndex
CREATE INDEX "item_category_id_idx" ON "item"("category_id");

-- CreateIndex
CREATE INDEX "item_unit_id_idx" ON "item"("unit_id");

-- CreateIndex
CREATE INDEX "item_status_is_deleted_idx" ON "item"("status", "is_deleted");

-- CreateIndex
CREATE INDEX "item_is_deleted_idx" ON "item"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_supplier_code_key" ON "supplier"("supplier_code");

-- CreateIndex
CREATE INDEX "supplier_supplier_code_idx" ON "supplier"("supplier_code");

-- CreateIndex
CREATE INDEX "supplier_status_is_deleted_idx" ON "supplier"("status", "is_deleted");

-- CreateIndex
CREATE INDEX "supplier_item_supplier_id_idx" ON "supplier_item"("supplier_id");

-- CreateIndex
CREATE INDEX "supplier_item_item_id_idx" ON "supplier_item"("item_id");

-- CreateIndex
CREATE INDEX "supplier_item_is_deleted_idx" ON "supplier_item"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_item_supplier_id_item_id_key" ON "supplier_item"("supplier_id", "item_id");

-- CreateIndex
CREATE INDEX "stock_item_id_idx" ON "stock"("item_id");

-- CreateIndex
CREATE INDEX "stock_status_is_deleted_idx" ON "stock"("status", "is_deleted");

-- CreateIndex
CREATE INDEX "stock_current_stock_idx" ON "stock"("current_stock");

-- CreateIndex
CREATE UNIQUE INDEX "stock_item_id_key" ON "stock"("item_id");

-- CreateIndex
CREATE INDEX "batch_stock_id_idx" ON "batch"("stock_id");

-- CreateIndex
CREATE INDEX "batch_external_order_ref_idx" ON "batch"("external_order_ref");

-- CreateIndex
CREATE INDEX "batch_batch_number_idx" ON "batch"("batch_number");

-- CreateIndex
CREATE INDEX "batch_received_date_idx" ON "batch"("received_date");

-- CreateIndex
CREATE INDEX "batch_expiration_date_idx" ON "batch"("expiration_date");

-- CreateIndex
CREATE INDEX "batch_purchase_request_ref_idx" ON "batch"("purchase_request_ref");

-- CreateIndex
CREATE INDEX "batch_is_deleted_idx" ON "batch"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "body_builder_body_builder_code_key" ON "body_builder"("body_builder_code");

-- CreateIndex
CREATE INDEX "body_builder_body_builder_code_idx" ON "body_builder"("body_builder_code");

-- CreateIndex
CREATE INDEX "body_builder_is_deleted_idx" ON "body_builder"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturer_manufacturer_code_key" ON "manufacturer"("manufacturer_code");

-- CreateIndex
CREATE INDEX "manufacturer_manufacturer_code_idx" ON "manufacturer"("manufacturer_code");

-- CreateIndex
CREATE INDEX "manufacturer_is_deleted_idx" ON "manufacturer"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "bus_plate_number_key" ON "bus"("plate_number");

-- CreateIndex
CREATE UNIQUE INDEX "bus_body_number_key" ON "bus"("body_number");

-- CreateIndex
CREATE INDEX "bus_plate_number_idx" ON "bus"("plate_number");

-- CreateIndex
CREATE INDEX "bus_body_number_idx" ON "bus"("body_number");

-- CreateIndex
CREATE INDEX "bus_status_is_deleted_idx" ON "bus"("status", "is_deleted");

-- CreateIndex
CREATE INDEX "bus_condition_idx" ON "bus"("condition");

-- CreateIndex
CREATE INDEX "bus_is_deleted_idx" ON "bus"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "second_hand_details_bus_id_key" ON "second_hand_details"("bus_id");

-- CreateIndex
CREATE INDEX "second_hand_details_bus_id_idx" ON "second_hand_details"("bus_id");

-- CreateIndex
CREATE INDEX "second_hand_details_source_idx" ON "second_hand_details"("source");

-- CreateIndex
CREATE INDEX "second_hand_details_is_deleted_idx" ON "second_hand_details"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "brand_new_details_bus_id_key" ON "brand_new_details"("bus_id");

-- CreateIndex
CREATE INDEX "brand_new_details_bus_id_idx" ON "brand_new_details"("bus_id");

-- CreateIndex
CREATE INDEX "brand_new_details_is_deleted_idx" ON "brand_new_details"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "disposal_disposal_code_key" ON "disposal"("disposal_code");

-- CreateIndex
CREATE INDEX "disposal_disposal_code_idx" ON "disposal"("disposal_code");

-- CreateIndex
CREATE INDEX "disposal_item_id_idx" ON "disposal"("item_id");

-- CreateIndex
CREATE INDEX "disposal_bus_id_idx" ON "disposal"("bus_id");

-- CreateIndex
CREATE INDEX "disposal_disposal_status_is_deleted_idx" ON "disposal"("disposal_status", "is_deleted");

-- CreateIndex
CREATE INDEX "disposal_disposal_date_idx" ON "disposal"("disposal_date");

-- CreateIndex
CREATE UNIQUE INDEX "order_order_code_key" ON "order"("order_code");

-- CreateIndex
CREATE INDEX "order_order_code_idx" ON "order"("order_code");

-- CreateIndex
CREATE INDEX "order_purchase_request_ref_idx" ON "order"("purchase_request_ref");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");

-- CreateIndex
CREATE INDEX "order_is_deleted_idx" ON "order"("is_deleted");

-- CreateIndex
CREATE INDEX "order_item_order_id_idx" ON "order_item"("order_id");

-- CreateIndex
CREATE INDEX "order_item_external_item_ref_idx" ON "order_item"("external_item_ref");

-- CreateIndex
CREATE INDEX "order_item_is_deleted_idx" ON "order_item"("is_deleted");

-- CreateIndex
CREATE INDEX "attachment_entity_type_entity_id_idx" ON "attachment"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "attachment_entity_type_idx" ON "attachment"("entity_type");

-- CreateIndex
CREATE INDEX "attachment_file_type_idx" ON "attachment"("file_type");

-- CreateIndex
CREATE INDEX "attachment_is_deleted_idx" ON "attachment"("is_deleted");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit_measure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_item" ADD CONSTRAINT "supplier_item_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_item" ADD CONSTRAINT "supplier_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_item" ADD CONSTRAINT "supplier_item_supplier_unit_id_fkey" FOREIGN KEY ("supplier_unit_id") REFERENCES "unit_measure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch" ADD CONSTRAINT "batch_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus" ADD CONSTRAINT "bus_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus" ADD CONSTRAINT "bus_body_builder_id_fkey" FOREIGN KEY ("body_builder_id") REFERENCES "body_builder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus" ADD CONSTRAINT "bus_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "second_hand_details" ADD CONSTRAINT "second_hand_details_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "bus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_new_details" ADD CONSTRAINT "brand_new_details_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "bus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal" ADD CONSTRAINT "disposal_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal" ADD CONSTRAINT "disposal_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal" ADD CONSTRAINT "disposal_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal" ADD CONSTRAINT "disposal_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
