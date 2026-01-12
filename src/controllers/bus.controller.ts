// src/controllers/bus.controller.ts
import { Request, Response } from 'express';
import * as busService from '../services/bus.service';


export const getAllBuses = async (_req: Request, res: Response) => {
  try {
    const buses = await busService.getAllBuses();
    res.json(buses);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
};


export const getBusById = async (req: Request, res: Response) => {
  try {
    const bus = await busService.getBusById(Number(req.params.id));
    if (!bus) {
      res.status(404).json({ error: 'Bus not found' });
      return;
    }
    res.json(bus);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
};
