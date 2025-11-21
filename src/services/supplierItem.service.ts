import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';

export interface SupplierItemCreateData {
  item_id: number | string;
  supplier_id: number;
  supplier_unit_id: number;
  conversion_amount: number;
  unit_price: number;
  description?: string;
}

export class SupplierItemService {
  async list(filters?: { item_id?: string | number; supplier_id?: number }) {
    const where: Record<string, unknown> = { is_deleted: false };
    if (filters?.item_id !== undefined) {
      const itemId = Number(filters.item_id);
      where['item_id'] = Number.isNaN(itemId) ? String(filters.item_id) : itemId;
    }
    if (filters?.supplier_id !== undefined) where['supplier_id'] = filters.supplier_id;

    const data = await prisma.supplier_item.findMany({
      where,
      include: {
        supplier: { select: { id: true, supplier_code: true, supplier_name: true } },
        supplier_unit: { select: { id: true, unit_name: true, abbreviation: true } },
        item: { select: { id: true, item_code: true, item_name: true } },
      },
    });

    // Map to frontend expected fields (data array)
    const mapped = data.map((d) => ({
      supplier_id: d.supplier ? d.supplier.supplier_code : undefined,
      supplier_numeric_id: d.supplier_id, // Include numeric ID for PATCH operations
      supplierName: d.supplier ? d.supplier.supplier_name : undefined,
      item: d.item ? { id: d.item.id, item_id: d.item.item_code, item_name: d.item.item_name } : undefined,
      unit: d.supplier_unit ? { id: d.supplier_unit.id, unit_name: d.supplier_unit.unit_name, abbreviation: d.supplier_unit.abbreviation } : undefined,
      unit_price: d.unit_price,
      conversion_amount: d.conversion_amount,
      note: d.description,
      description: d.description, // Also include as description for consistency
      date_created: d.created_at,
      date_updated: d.updated_at,
      isdeleted: d.is_deleted,
    }));

    return { data: mapped };
  }

  async create(body: SupplierItemCreateData) {
    // validate required
    if (!body.item_id || !body.supplier_id || !body.supplier_unit_id || body.unit_price === undefined) {
      throw new BadRequestError('Missing required fields');
    }

    // resolve item id: accept numeric id or code
    let itemIdNum: number | undefined;
    const parsed = Number(body.item_id as any);
    if (!Number.isNaN(parsed)) {
      itemIdNum = parsed;
    } else {
      const item = await prisma.item.findFirst({ where: { item_code: String(body.item_id), is_deleted: false } });
      if (!item) throw new NotFoundError('Item not found');
      itemIdNum = item.id;
    }

    // check supplier exists
    const supplier = await prisma.supplier.findUnique({ where: { id: body.supplier_id } });
    if (!supplier || supplier.is_deleted) throw new NotFoundError('Supplier not found');

    // check unit exists
    const unit = await prisma.unit_measure.findUnique({ where: { id: body.supplier_unit_id } });
    if (!unit || unit.is_deleted) throw new NotFoundError('Unit not found');

    // check existing
    const existing = await prisma.supplier_item.findUnique({
      where: { supplier_id_item_id: { supplier_id: body.supplier_id, item_id: itemIdNum! } },
    });
    if (existing && !existing.is_deleted) {
      throw new BadRequestError('Supplier-item relation already exists');
    }

    const created = await prisma.supplier_item.create({
      data: {
        supplier_id: body.supplier_id,
        item_id: itemIdNum!,
        supplier_unit_id: body.supplier_unit_id,
        conversion_amount: body.conversion_amount as unknown as number,
        unit_price: body.unit_price as unknown as number,
        description: body.description ?? undefined,
      },
      include: { supplier: true, supplier_unit: true, item: true },
    });

    // Return out shape similar to the old fullstack frontend expectations
    const out = {
      id: created.supplier_id ?? undefined,
      supplier_id: created.supplier ? created.supplier.supplier_code : created.supplier_id,
      supplier_numeric_id: created.supplier_id, // Include numeric ID for frontend
      supplierName: created.supplier?.supplier_name,
      supplier_unit_id: created.supplier_unit_id, // Include for mapping
      conversion_amount: created.conversion_amount, // Include for display
      unit_price: created.unit_price,
      note: created.description ?? undefined,
      description: created.description ?? undefined,
      date_updated: created.updated_at,
      updated_at: created.updated_at,
    };

    return out;
  }

  async patch(supplierId: number, itemId: number, data: Record<string, unknown>) {
    const existing = await prisma.supplier_item.findUnique({ where: { supplier_id_item_id: { supplier_id: supplierId, item_id: itemId } } });
    if (!existing) throw new NotFoundError('Supplier-item not found');

    const updateData: any = {};
    if (data.unit_price !== undefined) updateData.unit_price = data.unit_price as number;
    if (data.description !== undefined) updateData.description = data.description as string | null;
    if (data.conversion_amount !== undefined) updateData.conversion_amount = data.conversion_amount as number;
    if (data.restore === true) updateData.is_deleted = false;

    const updated = await prisma.supplier_item.update({
      where: { supplier_id_item_id: { supplier_id: supplierId, item_id: itemId } },
      data: updateData,
      include: { supplier: true, supplier_unit: true, item: true },
    });

    // Match frontend response shape
    return { data: updated, date_updated: updated.updated_at, updated_at: updated.updated_at };
  }

  async remove(supplierId: number, itemId: number) {
    const existing = await prisma.supplier_item.findUnique({ where: { supplier_id_item_id: { supplier_id: supplierId, item_id: itemId } } });
    if (!existing) throw new NotFoundError('Supplier-item not found');
    if (existing.is_deleted) throw new BadRequestError('Already deleted');

    await prisma.supplier_item.update({ where: { supplier_id_item_id: { supplier_id: supplierId, item_id: itemId } }, data: { is_deleted: true } });
    return { success: true };
  }
}

export const supplierItemService = new SupplierItemService();
