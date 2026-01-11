import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
// logger intentionally not used here; keep imports minimal

function formatLongDate(d?: Date | string | null) {
  if (!d) return null;
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function computeStatusFromRules(totalQty: number, reorderLevel: number, category?: string, storedStatus?: string, batches?: any[]) {
  const cat = (category || '').toLowerCase();
  const today = new Date();

  // EXPIRED: any batch expiration_date <= today (auto-computed, takes priority)
  if (batches && batches.some((b: any) => b.expiration_date && new Date(b.expiration_date) <= today)) return 'EXPIRED';

  // For consumables, always compute status based on quantity (for accurate inventory tracking)
  if (cat === 'consumable') {
    if (totalQty === 0) return 'OUT_OF_STOCK';
    if (totalQty < reorderLevel) return 'LOW_STOCK';
    return 'AVAILABLE';
  }

  // For non-consumables (Equipment, Tool, etc.), respect the stored status from database
  // These are typically manually managed statuses
  if (storedStatus && storedStatus !== 'INACTIVE') {
    return storedStatus;
  }

  // Fallback: compute based on quantity if no stored status or INACTIVE
  return totalQty > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK';
}

export interface StockListFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  fromDate?: string;
  toDate?: string;
  minQty?: number;
  maxQty?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  order?: 'asc' | 'desc';
}

export class StockService {
  async listStocks(filters: StockListFilters) {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const where: Prisma.stockWhereInput = { is_deleted: false } as any;

    if (filters.search) {
      const q = filters.search;
      where.AND = [
        {
          OR: [
            { item: { item_name: { contains: q, mode: 'insensitive' } } },
            { item: { item_code: { contains: q, mode: 'insensitive' } } },
            { item: { category: { category_name: { contains: q, mode: 'insensitive' } } } },
            { item: { supplier_items: { some: { supplier: { supplier_name: { contains: q, mode: 'insensitive' } } } } } },
          ],
        },
      ];
    }

    if (filters.category) where.item = { category: { category_name: { contains: filters.category, mode: 'insensitive' } } } as any;

    if (filters.fromDate || filters.toDate) {
      const range: any = {};
      if (filters.fromDate) range.gte = new Date(filters.fromDate);
      if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999);
        range.lte = toDate;
      }
      (where as any).created_at = range;
    }

    if (typeof filters.minQty !== 'undefined' || typeof filters.maxQty !== 'undefined') {
      const qRange: any = {};
      if (typeof filters.minQty !== 'undefined') qRange.gte = filters.minQty;
      if (typeof filters.maxQty !== 'undefined') qRange.lte = filters.maxQty;
      (where as any).current_stock = qRange;
    }

    // Determine sort order - support both 'sortOrder' and 'order' parameters
    const sortOrder = (filters.sortOrder || filters.order || 'asc') as 'asc' | 'desc';

    const orderBy: any = {};
    if (filters.sortBy) {
      const map: Record<string, string> = { itemName: 'item_id', currentStock: 'current_stock', reorderLevel: 'reorder_level', createdAt: 'created_at' };
      orderBy[map[filters.sortBy] || 'created_at'] = sortOrder;
    } else {
      orderBy.created_at = 'desc';
    }

    // Fetch all matching records (before status filtering and pagination)
    const allRows = await prisma.stock.findMany({
      where,
      include: { item: { include: { category: true, unit: true, supplier_items: { include: { supplier: true } } } }, batches: { where: { is_deleted: false } } },
    });

    // Map and compute status for each record
    const mappedRows = allRows.map((r: any) => {
      const batches = r.batches || [];
      const totalQty = batches.reduce((acc: number, b: any) => acc + Number(b.quantity || 0), 0);
      const computedStatus = computeStatusFromRules(totalQty, Number(r.reorder_level || 0), r.item?.category?.category_name, r.status, batches);

      return {
        id: r.id,
        itemId: r.item?.id,
        stockCode: `STK-${r.id.toString().padStart(5, '0')}`,
        itemName: r.item?.item_name,
        unit: r.item?.unit?.abbreviation || r.item?.unit?.unit_name,
        category: r.item?.category?.category_name,
        currentStock: totalQty,
        reorderLevel: Number(r.reorder_level || 0),
        status: computedStatus,
        createdAt: formatLongDate(r.created_at),
        updatedAt: formatLongDate(r.updated_at),
        _raw: r, // Keep raw data for sorting
      };
    });

    // Apply status filter on computed status
    let filteredRows = mappedRows;
    if (filters.status) {
      const statusArray = filters.status.split(',').map((s: string) => s.trim().toUpperCase());
      filteredRows = mappedRows.filter((r: any) => statusArray.includes(r.status));
    }

    // Apply sorting on the filtered data
    filteredRows.sort((a: any, b: any) => {
      let aVal: any = a.createdAt;
      let bVal: any = b.createdAt;

      if (filters.sortBy === 'itemName') {
        aVal = a.itemName || '';
        bVal = b.itemName || '';
      } else if (filters.sortBy === 'currentStock') {
        aVal = a.currentStock;
        bVal = b.currentStock;
      } else if (filters.sortBy === 'reorderLevel') {
        aVal = a.reorderLevel;
        bVal = b.reorderLevel;
      } else if (filters.sortBy === 'createdAt') {
        aVal = new Date(a._raw.created_at).getTime();
        bVal = new Date(b._raw.created_at).getTime();
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    // Apply pagination on filtered and sorted data
    const paginatedData = filteredRows.slice(skip, skip + limit);
    const total = filteredRows.length;

    // Remove _raw property from final output
    const data = paginatedData.map((r: any) => {
      const { _raw, ...rest } = r;
      return rest;
    });

    return { success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getStockById(id: number) {
    const s = await prisma.stock.findFirst({ where: { id, is_deleted: false }, include: { item: { include: { category: true, unit: true, supplier_items: { include: { supplier: true } } } }, batches: { where: { is_deleted: false }, orderBy: { received_date: 'desc' } } } });
    if (!s) throw new NotFoundError('Stock not found');

    const batches = (s.batches || []).map((b: any) => ({ id: b.id, batchNumber: b.batch_number, quantity: Number(b.quantity), expirationDate: formatLongDate(b.expiration_date), receivedDate: formatLongDate(b.received_date), createdAt: formatLongDate(b.created_at), remarks: b.remarks }));
    const totalQty = (s.batches || []).reduce((acc: number, b: any) => acc + Number(b.quantity || 0), 0);
    const status = computeStatusFromRules(totalQty, Number(s.reorder_level || 0), s.item?.category?.category_name, s.status, s.batches);

    return { stock: { id: s.id, itemId: s.item?.id, itemName: s.item?.item_name, stockCode: `STK-${s.id.toString().padStart(5, '0')}`, unit: s.item?.unit?.abbreviation || s.item?.unit?.unit_name, category: s.item?.category?.category_name, currentStock: totalQty, reorderLevel: Number(s.reorder_level || 0), status, createdAt: formatLongDate(s.created_at), updatedAt: formatLongDate(s.updated_at) }, batches };
  }

  async createStock(payload: any, userId: string) {
    if (!payload.itemId) throw new BadRequestError('itemId is required');

    const item = await prisma.item.findFirst({ where: { id: payload.itemId, is_deleted: false }, include: { category: true } });
    if (!item) throw new NotFoundError('Item not found');
    if (!item.item_code) throw new BadRequestError('Item must have an item_code');

    const isConsumable = (item.category?.category_name || '').toLowerCase() === 'consumable';
    if (isConsumable && (typeof payload.reorderLevel === 'undefined' || payload.reorderLevel === null)) throw new BadRequestError('reorderLevel is required for consumables');

    const stock = await prisma.stock.create({ data: { item_code: item.item_code, current_stock: payload.currentStock ?? 0, reorder_level: payload.reorderLevel ?? 0, status: 'AVAILABLE', created_by: userId } });

    if (Array.isArray(payload.batches) && payload.batches.length) {
      for (const b of payload.batches) await prisma.batch.create({ data: { stock_id: stock.id, batch_number: b.batchNumber, quantity: b.quantity ?? 0, expiration_date: b.expirationDate ? new Date(b.expirationDate) : undefined, received_date: b.receivedDate ? new Date(b.receivedDate) : undefined, remarks: b.remarks, created_by: userId } });
      const batches = await prisma.batch.findMany({ where: { stock_id: stock.id, is_deleted: false } });
      const total = batches.reduce((acc, b) => acc + Number(b.quantity || 0), 0);
      await prisma.stock.update({ where: { id: stock.id }, data: { current_stock: total } });
    }

    return this.getStockById(stock.id);
  }

  async updateStock(id: number, payload: any, userId: string) {
    const stock = await prisma.stock.findFirst({ where: { id, is_deleted: false }, include: { item: { include: { category: true } }, batches: { where: { is_deleted: false } } } });
    if (!stock) throw new NotFoundError('Stock not found');

    const isConsumable = (stock.item?.category?.category_name || '').toLowerCase() === 'consumable';
    if (isConsumable && (typeof payload.reorderLevel === 'undefined' || payload.reorderLevel === null)) throw new BadRequestError('reorderLevel is required for consumables');

    const updateData: any = { updated_by: userId };
    if (typeof payload.reorderLevel !== 'undefined') updateData.reorder_level = payload.reorderLevel;
    if (typeof payload.status !== 'undefined') updateData.status = payload.status;

    if (typeof payload.batches !== 'undefined' && Array.isArray(payload.batches)) {
      for (const b of payload.batches) {
        if (b.id) {
          await prisma.batch.update({ where: { id: b.id }, data: { batch_number: b.batchNumber, quantity: b.quantity, expiration_date: b.expirationDate ? new Date(b.expirationDate) : null, received_date: b.receivedDate ? new Date(b.receivedDate) : undefined, remarks: b.remarks, updated_by: userId } });
        } else {
          await prisma.batch.create({ data: { stock_id: id, batch_number: b.batchNumber, quantity: b.quantity ?? 0, expiration_date: b.expirationDate ? new Date(b.expirationDate) : undefined, received_date: b.receivedDate ? new Date(b.receivedDate) : undefined, remarks: b.remarks, created_by: userId } });
        }
      }
    }

    await prisma.stock.update({ where: { id }, data: updateData });

    const batches = await prisma.batch.findMany({ where: { stock_id: id, is_deleted: false } });
    const total = batches.reduce((acc, b) => acc + Number(b.quantity || 0), 0);
    await prisma.stock.update({ where: { id }, data: { current_stock: total } });

    return this.getStockById(id);
  }

  async softDeleteBatch(stockId: number, batchId: number, userId: string) {
    const batch = await prisma.batch.findFirst({ where: { id: batchId, stock_id: stockId, is_deleted: false } });
    if (!batch) throw new NotFoundError('Batch not found');

    await prisma.batch.update({ where: { id: batchId }, data: { is_deleted: true, deleted_by: userId, deleted_at: new Date() } });

    const batches = await prisma.batch.findMany({ where: { stock_id: stockId, is_deleted: false } });
    const total = batches.reduce((acc, b) => acc + Number(b.quantity || 0), 0);
    await prisma.stock.update({ where: { id: stockId }, data: { current_stock: total } });

    return this.getStockById(stockId);
  }

  async deleteStock(id: number, userId: string) {
    const s = await prisma.stock.findFirst({ where: { id, is_deleted: false } });
    if (!s) throw new NotFoundError('Stock not found');
    await prisma.stock.update({ where: { id }, data: { is_deleted: true, deleted_by: userId, deleted_at: new Date() } });
    return { success: true };
  }
}

export const stockService = new StockService();
