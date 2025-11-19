import { prisma } from '../config/database';
import { generateId } from '../lib/idGenerator';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/errors';
import type { item_status } from '@prisma/client';

export interface SupplierCreateData {
  supplier_name: string;
  contact_number: string;
  email?: string;
  street?: string;
  barangay?: string;
  city?: string;
  province?: string;
  status?: string;
  description?: string;
}

export class SupplierService {
  async listSuppliers() {
    const suppliers = await prisma.supplier.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        supplier_code: true,
        supplier_name: true,
        contact_number: true,
        email: true,
        street: true,
        barangay: true,
        city: true,
        province: true,
        status: true,
        description: true,
        created_at: true,
        updated_at: true,
        is_deleted: true,
        _count: { select: { supplier_items: true } },
      },
      orderBy: { supplier_name: 'asc' },
    });

    const mapped = suppliers.map((s) => {
      // Map backend field names to the frontend-expected shape
      const itemCount = ((s as any)['_count'] as { supplier_items?: number })?.supplier_items ?? 0;
      return {
        id: s.id,
        supplier_id: s.supplier_code,
        supplier_name: s.supplier_name,
        contact_number: s.contact_number,
        email: s.email,
        street: s.street,
        barangay: s.barangay,
        city: s.city,
        province: s.province,
        status: s.status,
        remarks: s.description,
        date_created: s.created_at,
        date_updated: s.updated_at,
        isdeleted: s.is_deleted,
        itemCount,
      } as Record<string, unknown> & { itemCount: number };
    });

    return { success: true, suppliers: mapped };
  }

  async createSupplier(data: SupplierCreateData) {
    if (!data.supplier_name || !data.contact_number) {
      throw new BadRequestError('supplier_name and contact_number are required');
    }

    // basic contact number validation (11 digits expected by frontend)
    if (!/^\d{11}$/.test(String(data.contact_number))) {
      throw new BadRequestError('Invalid contact number format. Expected 11 digits.');
    }

    // generate code
    const newCode = await generateId('supplier', 'SUP');

    // create
    try {
      const createData: any = {
        supplier_code: newCode,
        supplier_name: String(data.supplier_name),
        contact_number: String(data.contact_number),
        email: data.email ?? undefined,
        street: data.street ?? undefined,
        barangay: data.barangay ?? undefined,
        city: data.city ?? undefined,
        province: data.province ?? undefined,
        description: data.description ?? undefined,
      };

      // only set status if matches enum
      if (data.status && (data.status === 'ACTIVE' || data.status === 'INACTIVE')) {
        createData.status = data.status as item_status;
      }

      const created = await prisma.supplier.create({ data: createData });
      return created;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create supplier';
      throw new ConflictError(message);
    }
  }

  async updateSupplier(id: number, data: Partial<SupplierCreateData>) {
    // basic validation if contact_number present
    if (data.contact_number && !/^\d{11}$/.test(String(data.contact_number))) {
      throw new BadRequestError('Invalid contact number format. Expected 11 digits.');
    }

    const updateData: any = {};
    if (data.supplier_name !== undefined) updateData.supplier_name = String(data.supplier_name);
    if (data.contact_number !== undefined) updateData.contact_number = String(data.contact_number);
    if (data.email !== undefined) updateData.email = data.email ?? null;
    if (data.street !== undefined) updateData.street = data.street ?? null;
    if (data.barangay !== undefined) updateData.barangay = data.barangay ?? null;
    if (data.city !== undefined) updateData.city = data.city ?? null;
    if (data.province !== undefined) updateData.province = data.province ?? null;
    if (data.description !== undefined) updateData.description = data.description ?? null;
    if (data.status !== undefined && (data.status === 'ACTIVE' || data.status === 'INACTIVE')) updateData.status = data.status;

    try {
      const updated = await prisma.supplier.update({ where: { id }, data: updateData });
      return updated;
    } catch (err: unknown) {
      throw new NotFoundError('Supplier not found');
    }
  }

  async getById(id: number) {
    const supplier = await prisma.supplier.findFirst({ where: { id, is_deleted: false } });
    if (!supplier) throw new NotFoundError('Supplier not found');
    return supplier;
  }
}

export const supplierService = new SupplierService();
