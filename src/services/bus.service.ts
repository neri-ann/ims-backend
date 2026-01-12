
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getActiveBusesForOperation = async () => {
  return prisma.bus.findMany({
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      plate_number: true,
      body_number: true,
      bus_type: true,
      seat_capacity: true,
    },
  });
};

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
    where: { id: id },
    include: {
      manufacturer: true,
      body_builder: true,
      // Add second_hand_details and brand_new_details if they exist as relations
    },
  });
};
