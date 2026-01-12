// src/services/bus.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllBuses = async () => {
  return prisma.bus.findMany({
    include: {
      manufacturer: true,
      body_builder: true,
      // Add second_hand_details and brand_new_details if they exist as relations
    },
  });
};

export const getBusById = async (id: number) => {
  return prisma.bus.findUnique({
    where: { id },
    include: {
      manufacturer: true,
      body_builder: true,
      // Add second_hand_details and brand_new_details if they exist as relations
    },
  });
};
