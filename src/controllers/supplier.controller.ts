import { Request, Response, NextFunction } from 'express';
import { supplierService } from '../services/supplier.service';
import type { supplier as Supplier } from '@prisma/client';
import { logger } from '../config/logger';

export class SupplierController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await supplierService.listSuppliers();
  res.json(result);
  return;
    } catch (error) {
      logger.error('[SupplierController] Error listing suppliers:', error);
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
  const created = await supplierService.createSupplier(data);

      // Map backend field names to the frontend-expected shape
      const out = {
        id: created.id,
  supplier_id: (created as Supplier).supplier_code,
        supplier_name: created.supplier_name,
        contact_number: created.contact_number,
        email: created.email,
        street: created.street,
        barangay: created.barangay,
        city: created.city,
        province: created.province,
        status: created.status,
        remarks: created.description,
        date_created: created.created_at,
        date_updated: created.updated_at,
        isdeleted: created.is_deleted,
      };

      // Match frontend POST: return created object directly with 201
  res.status(201).json(out);
  return;
    } catch (error) {
      logger.error('[SupplierController] Error creating supplier:', error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) { res.status(400).json({ error: 'Invalid id' }); return; }
      const data = req.body;
      const updated = await supplierService.updateSupplier(id, data);

      const out = {
        id: updated.id,
        supplier_id: (updated as Supplier).supplier_code,
        supplier_name: updated.supplier_name,
        contact_number: updated.contact_number,
        email: updated.email,
        street: updated.street,
        barangay: updated.barangay,
        city: updated.city,
        province: updated.province,
        status: updated.status,
        remarks: updated.description,
        date_created: updated.created_at,
        date_updated: updated.updated_at,
        isdeleted: updated.is_deleted,
      };

      res.json({ success: true, data: out });
      return;
    } catch (error) {
      logger.error('[SupplierController] Error updating supplier:', error);
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const idParam = req.params.id;
      const numericId = Number(idParam);

      let s;
      if (Number.isNaN(numericId)) {
        // Treat as supplier_code
        s = await supplierService.getByCode(idParam);
      } else {
        // Treat as numeric ID
        s = await supplierService.getById(numericId);
      }

      if (!s) {
        res.status(404).json({ success: false, error: 'Supplier not found' });
        return;
      }

      const out = {
        id: s.id,
  supplier_id: (s as Supplier).supplier_code,
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
      };

  res.json({ success: true, data: out });
  return;
    } catch (error) {
      logger.error('[SupplierController] Error fetching supplier:', error);
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/suppliers/unrecorded
   * Create unrecorded supplier (from purchase request)
   */
  async createUnrecordedSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('[SupplierController] Create unrecorded supplier request:', req.body);

      const { supplierName, contactNumber, email, street, barangay, city, province, createdBy } = req.body;

      if (!supplierName) {
        res.status(400).json({ error: 'Supplier name is required' });
        return;
      }

      const supplier = await supplierService.createUnrecordedSupplier({
        supplierName,
        contactNumber,
        email,
        street,
        barangay,
        city,
        province,
        createdBy: createdBy || 'purchase-request',
      });

      res.status(201).json({
        success: true,
        data: {
          supplier_code: supplier.supplier_code,
          supplier_name: supplier.supplier_name,
          contact_number: supplier.contact_number,
          email: supplier.email,
          street: supplier.street,
          barangay: supplier.barangay,
          city: supplier.city,
          province: supplier.province,
          status: supplier.status,
          is_recorded: supplier.is_recorded,
        },
      });
      return;
    } catch (error) {
      logger.error('[SupplierController] Error creating unrecorded supplier:', error);
      next(error);
    }
  }
}

export const supplierController = new SupplierController();
