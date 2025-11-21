import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class UnitService {
  async list() {
    const units = await prisma.unit_measure.findMany({ 
      where: { is_deleted: false }, 
      select: {
        id: true,
        unit_code: true,
        unit_name: true,
        abbreviation: true,
        description: true
      },
      orderBy: { unit_name: 'asc' } 
    });
    return units;
  }

  async getById(id: number) {
    const unit = await prisma.unit_measure.findUnique({ where: { id } });
    if (!unit || unit.is_deleted) throw new NotFoundError('Unit not found');
    return unit;
  }
}

export const unitService = new UnitService();
