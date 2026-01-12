// src/controllers/busOperation.controller.ts
import { Request, Response } from 'express';
import * as busService from '../services/bus.service';

export const getActiveBusesForOperation = async (_req: Request, res: Response) => {
  try {
    const buses = await busService.getActiveBusesForOperation();
    const mapped = buses.map(bus => ({
      id: bus.id,
      license_plate: bus.plate_number,
      body_number: bus.body_number,
      type: bus.bus_type,
      capacity: bus.seat_capacity,
    }));
    res.json(mapped);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
};
