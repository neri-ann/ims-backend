-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('INACTIVE', 'AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'NOT_AVAILABLE', 'UNDER_MAINTENANCE', 'EXPIRED', 'IN_USE', 'DISPOSED');

-- CreateEnum
CREATE TYPE "BusStatus" AS ENUM ('ACTIVE', 'DECOMMISSIONED', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "BusType" AS ENUM ('AIRCONDITIONED', 'ORDINARY');

-- CreateEnum
CREATE TYPE "BusCondition" AS ENUM ('BRAND_NEW', 'SECOND_HAND');

-- CreateEnum
CREATE TYPE "BusSource" AS ENUM ('DEALERSHIP', 'AUCTION', 'PRIVATE_INDIVIDUAL', 'COMPANY_FLEET');

-- CreateEnum
CREATE TYPE "AcquisitionMethod" AS ENUM ('PURCHASED', 'LEASED', 'DONATED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'NOT_REGISTERED', 'NEEDS_RENEWAL', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DisposalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DisposalMethod" AS ENUM ('SOLD', 'SCRAPPED', 'DONATED', 'TRANSFERRED', 'WRITTEN_OFF');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'PARTIALLY_COMPLETED', 'TO_BE_REFUNDED', 'TO_BE_REPLACED', 'CLOSED');

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitMeasure" (
    "id" SERIAL NOT NULL,
    "unitCode" TEXT NOT NULL,
    "unitName" TEXT NOT NULL,
    "abbreviation" TEXT,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UnitMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "supplierCode" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "contactNumber" TEXT,
    "email" TEXT,
    "street" TEXT,
    "barangay" TEXT,
    "city" TEXT,
    "province" TEXT,
    "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierItem" (
    "supplierId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "supplierUnitId" INTEGER NOT NULL,
    "conversionAmount" DECIMAL(12,4) NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "currentStock" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "reorderLevel" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "InventoryStatus" NOT NULL DEFAULT 'INACTIVE',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" SERIAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    "batchNumber" TEXT,
    "usableQuantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "defectiveQuantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "missingQuantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "expirationDate" TIMESTAMP(3),
    "receivedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "externalOrderRef" TEXT,
    "purchaseRequestRef" TEXT,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyBuilder" (
    "id" SERIAL NOT NULL,
    "bodyBuilderCode" TEXT NOT NULL,
    "bodyBuilderName" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BodyBuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" SERIAL NOT NULL,
    "manufacturerCode" TEXT NOT NULL,
    "manufacturerName" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dealer" (
    "id" SERIAL NOT NULL,
    "dealerCode" TEXT NOT NULL,
    "dealerName" TEXT NOT NULL,
    "contactNumber" TEXT,
    "email" TEXT,
    "address" TEXT,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bus" (
    "id" SERIAL NOT NULL,
    "stockId" INTEGER,
    "plateNumber" TEXT NOT NULL,
    "bodyNumber" TEXT NOT NULL,
    "bodyBuilderId" INTEGER NOT NULL,
    "busType" "BusType" NOT NULL,
    "manufacturerId" INTEGER NOT NULL,
    "status" "BusStatus" NOT NULL DEFAULT 'ACTIVE',
    "chassisNumber" TEXT,
    "engineNumber" TEXT,
    "seatCapacity" INTEGER,
    "model" TEXT,
    "yearModel" INTEGER,
    "condition" "BusCondition" NOT NULL,
    "acquisitionDate" TIMESTAMP(3),
    "acquisitionMethod" "AcquisitionMethod" NOT NULL,
    "warrantyExpirationDate" TIMESTAMP(3),
    "registrationStatus" "RegistrationStatus",
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecondHandDetails" (
    "id" SERIAL NOT NULL,
    "busId" INTEGER NOT NULL,
    "previousOwner" TEXT,
    "previousOwnerContact" TEXT,
    "source" "BusSource" NOT NULL,
    "odometerReading" DECIMAL(12,2),
    "lastRegistrationDate" TIMESTAMP(3),
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SecondHandDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandNewDetails" (
    "id" SERIAL NOT NULL,
    "busId" INTEGER NOT NULL,
    "dealerId" INTEGER NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BrandNewDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disposal" (
    "id" SERIAL NOT NULL,
    "disposalCode" TEXT NOT NULL,
    "itemId" INTEGER,
    "busId" INTEGER,
    "batchId" INTEGER,
    "stockId" INTEGER,
    "quantity" DECIMAL(12,2),
    "disposalDate" TIMESTAMP(3) NOT NULL,
    "disposalMethod" "DisposalMethod" NOT NULL,
    "description" TEXT,
    "estimatedValue" DECIMAL(12,2),
    "actualValue" DECIMAL(12,2),
    "disposalStatus" "DisposalStatus" NOT NULL DEFAULT 'PENDING',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Disposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderCode" TEXT NOT NULL,
    "purchaseRequestRef" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "externalBatchRefs" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "closedBy" TEXT,
    "closedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "externalItemRef" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "orderedQuantity" DECIMAL(12,2) NOT NULL,
    "orderedUnitPrice" DECIMAL(12,2) NOT NULL,
    "orderedTotalPrice" DECIMAL(12,2) NOT NULL,
    "receivedQuantity" DECIMAL(12,2) DEFAULT 0,
    "actualUnitPrice" DECIMAL(12,2),
    "actualTotalPrice" DECIMAL(12,2),
    "missingQuantity" DECIMAL(12,2) DEFAULT 0,
    "damagedQuantity" DECIMAL(12,2) DEFAULT 0,
    "batchNumber" TEXT,
    "expirationDate" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "description" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryCode_key" ON "Category"("categoryCode");

-- CreateIndex
CREATE INDEX "Category_categoryCode_idx" ON "Category"("categoryCode");

-- CreateIndex
CREATE INDEX "Category_isDeleted_idx" ON "Category"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "UnitMeasure_unitCode_key" ON "UnitMeasure"("unitCode");

-- CreateIndex
CREATE INDEX "UnitMeasure_unitCode_idx" ON "UnitMeasure"("unitCode");

-- CreateIndex
CREATE INDEX "UnitMeasure_isDeleted_idx" ON "UnitMeasure"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "Item_itemCode_key" ON "Item"("itemCode");

-- CreateIndex
CREATE INDEX "Item_itemCode_idx" ON "Item"("itemCode");

-- CreateIndex
CREATE INDEX "Item_categoryId_idx" ON "Item"("categoryId");

-- CreateIndex
CREATE INDEX "Item_unitId_idx" ON "Item"("unitId");

-- CreateIndex
CREATE INDEX "Item_status_isDeleted_idx" ON "Item"("status", "isDeleted");

-- CreateIndex
CREATE INDEX "Item_isDeleted_idx" ON "Item"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplierCode_key" ON "Supplier"("supplierCode");

-- CreateIndex
CREATE INDEX "Supplier_supplierCode_idx" ON "Supplier"("supplierCode");

-- CreateIndex
CREATE INDEX "Supplier_status_isDeleted_idx" ON "Supplier"("status", "isDeleted");

-- CreateIndex
CREATE INDEX "SupplierItem_supplierId_idx" ON "SupplierItem"("supplierId");

-- CreateIndex
CREATE INDEX "SupplierItem_itemId_idx" ON "SupplierItem"("itemId");

-- CreateIndex
CREATE INDEX "SupplierItem_isDeleted_idx" ON "SupplierItem"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierItem_supplierId_itemId_key" ON "SupplierItem"("supplierId", "itemId");

-- CreateIndex
CREATE INDEX "Stock_itemId_idx" ON "Stock"("itemId");

-- CreateIndex
CREATE INDEX "Stock_status_isDeleted_idx" ON "Stock"("status", "isDeleted");

-- CreateIndex
CREATE INDEX "Stock_currentStock_idx" ON "Stock"("currentStock");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_itemId_key" ON "Stock"("itemId");

-- CreateIndex
CREATE INDEX "Batch_stockId_idx" ON "Batch"("stockId");

-- CreateIndex
CREATE INDEX "Batch_externalOrderRef_idx" ON "Batch"("externalOrderRef");

-- CreateIndex
CREATE INDEX "Batch_batchNumber_idx" ON "Batch"("batchNumber");

-- CreateIndex
CREATE INDEX "Batch_receivedDate_idx" ON "Batch"("receivedDate");

-- CreateIndex
CREATE INDEX "Batch_expirationDate_idx" ON "Batch"("expirationDate");

-- CreateIndex
CREATE INDEX "Batch_purchaseRequestRef_idx" ON "Batch"("purchaseRequestRef");

-- CreateIndex
CREATE INDEX "Batch_isDeleted_idx" ON "Batch"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "BodyBuilder_bodyBuilderCode_key" ON "BodyBuilder"("bodyBuilderCode");

-- CreateIndex
CREATE INDEX "BodyBuilder_bodyBuilderCode_idx" ON "BodyBuilder"("bodyBuilderCode");

-- CreateIndex
CREATE INDEX "BodyBuilder_isDeleted_idx" ON "BodyBuilder"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_manufacturerCode_key" ON "Manufacturer"("manufacturerCode");

-- CreateIndex
CREATE INDEX "Manufacturer_manufacturerCode_idx" ON "Manufacturer"("manufacturerCode");

-- CreateIndex
CREATE INDEX "Manufacturer_isDeleted_idx" ON "Manufacturer"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "Dealer_dealerCode_key" ON "Dealer"("dealerCode");

-- CreateIndex
CREATE INDEX "Dealer_dealerCode_idx" ON "Dealer"("dealerCode");

-- CreateIndex
CREATE INDEX "Dealer_isDeleted_idx" ON "Dealer"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "Bus_plateNumber_key" ON "Bus"("plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Bus_bodyNumber_key" ON "Bus"("bodyNumber");

-- CreateIndex
CREATE INDEX "Bus_plateNumber_idx" ON "Bus"("plateNumber");

-- CreateIndex
CREATE INDEX "Bus_bodyNumber_idx" ON "Bus"("bodyNumber");

-- CreateIndex
CREATE INDEX "Bus_status_isDeleted_idx" ON "Bus"("status", "isDeleted");

-- CreateIndex
CREATE INDEX "Bus_condition_idx" ON "Bus"("condition");

-- CreateIndex
CREATE INDEX "Bus_isDeleted_idx" ON "Bus"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "SecondHandDetails_busId_key" ON "SecondHandDetails"("busId");

-- CreateIndex
CREATE INDEX "SecondHandDetails_busId_idx" ON "SecondHandDetails"("busId");

-- CreateIndex
CREATE INDEX "SecondHandDetails_source_idx" ON "SecondHandDetails"("source");

-- CreateIndex
CREATE INDEX "SecondHandDetails_isDeleted_idx" ON "SecondHandDetails"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "BrandNewDetails_busId_key" ON "BrandNewDetails"("busId");

-- CreateIndex
CREATE INDEX "BrandNewDetails_busId_idx" ON "BrandNewDetails"("busId");

-- CreateIndex
CREATE INDEX "BrandNewDetails_dealerId_idx" ON "BrandNewDetails"("dealerId");

-- CreateIndex
CREATE INDEX "BrandNewDetails_isDeleted_idx" ON "BrandNewDetails"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "Disposal_disposalCode_key" ON "Disposal"("disposalCode");

-- CreateIndex
CREATE INDEX "Disposal_disposalCode_idx" ON "Disposal"("disposalCode");

-- CreateIndex
CREATE INDEX "Disposal_itemId_idx" ON "Disposal"("itemId");

-- CreateIndex
CREATE INDEX "Disposal_busId_idx" ON "Disposal"("busId");

-- CreateIndex
CREATE INDEX "Disposal_disposalStatus_isDeleted_idx" ON "Disposal"("disposalStatus", "isDeleted");

-- CreateIndex
CREATE INDEX "Disposal_disposalDate_idx" ON "Disposal"("disposalDate");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderCode_key" ON "Order"("orderCode");

-- CreateIndex
CREATE INDEX "Order_orderCode_idx" ON "Order"("orderCode");

-- CreateIndex
CREATE INDEX "Order_purchaseRequestRef_idx" ON "Order"("purchaseRequestRef");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_isDeleted_idx" ON "Order"("isDeleted");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_externalItemRef_idx" ON "OrderItem"("externalItemRef");

-- CreateIndex
CREATE INDEX "OrderItem_isDeleted_idx" ON "OrderItem"("isDeleted");

-- CreateIndex
CREATE INDEX "Attachment_entityType_entityId_idx" ON "Attachment"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Attachment_entityType_idx" ON "Attachment"("entityType");

-- CreateIndex
CREATE INDEX "Attachment_fileType_idx" ON "Attachment"("fileType");

-- CreateIndex
CREATE INDEX "Attachment_isDeleted_idx" ON "Attachment"("isDeleted");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitMeasure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierItem" ADD CONSTRAINT "SupplierItem_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierItem" ADD CONSTRAINT "SupplierItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierItem" ADD CONSTRAINT "SupplierItem_supplierUnitId_fkey" FOREIGN KEY ("supplierUnitId") REFERENCES "UnitMeasure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bus" ADD CONSTRAINT "Bus_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bus" ADD CONSTRAINT "Bus_bodyBuilderId_fkey" FOREIGN KEY ("bodyBuilderId") REFERENCES "BodyBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bus" ADD CONSTRAINT "Bus_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondHandDetails" ADD CONSTRAINT "SecondHandDetails_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandNewDetails" ADD CONSTRAINT "BrandNewDetails_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandNewDetails" ADD CONSTRAINT "BrandNewDetails_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disposal" ADD CONSTRAINT "Disposal_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disposal" ADD CONSTRAINT "Disposal_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disposal" ADD CONSTRAINT "Disposal_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disposal" ADD CONSTRAINT "Disposal_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
