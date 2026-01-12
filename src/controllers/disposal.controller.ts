
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// List BUS disposals (disposal.bus_id is not NULL)
async function listBusDisposals(_req: Request, res: Response) {
  try {
    const disposals = await prisma.disposal.findMany({
      where: { bus_id: { not: null } },
      include: {
        bus: true,
        batch: true,
        stock: true,
      },
      orderBy: { disposal_date: 'desc' },
    });
    res.json(disposals);
    return;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    res.status(500).json({ error: error.message });
    return;
  }
}

// List Stock disposals (disposal.stock_id and batch_id are not NULL)
async function listStockDisposals(_req: Request, res: Response) {
  try {
    const disposals = await prisma.disposal.findMany({
      where: {
        stock_id: { not: null },
        batch_id: { not: null },
      },
      include: {
        stock: true,
        batch: true,
        bus: true,
      },
      orderBy: { disposal_date: 'desc' },
    });
    res.json(disposals);
    return;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    res.status(500).json({ error: error.message });
    return;
  }
}

// Get disposal by id (joined)
async function getDisposalById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const disposal = await prisma.disposal.findUnique({
      where: { id: Number(id) },
      include: {
        bus: true,
        batch: true,
        stock: true,
      },
    });
    if (!disposal) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(disposal);
    return;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    res.status(500).json({ error: error.message });
    return;
  }
}

export { listBusDisposals, listStockDisposals, getDisposalById };
