/**
 * Shared Error Handler
 * Centralized error handling utilities
 */

import { Prisma } from '@prisma/client';

/**
 * API Error class for structured error handling
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handle Prisma errors and convert to user-friendly messages
 */
export function handlePrismaError(error: unknown): { statusCode: number; message: string; details?: any } {
  // Prisma Client Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        return {
          statusCode: 409,
          message: 'A record with this unique field already exists',
          details: { field: error.meta?.target },
        };
      case 'P2003':
        // Foreign key constraint violation
        return {
          statusCode: 400,
          message: 'Invalid reference to related record',
          details: { field: error.meta?.field_name },
        };
      case 'P2025':
        // Record not found
        return {
          statusCode: 404,
          message: 'Record not found',
        };
      case 'P2014':
        // Required relation violation
        return {
          statusCode: 400,
          message: 'Required relation constraint failed',
        };
      default:
        return {
          statusCode: 400,
          message: 'Database operation failed',
          details: { code: error.code },
        };
    }
  }

  // Prisma Validation Errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: 'Invalid data provided',
    };
  }

  // Generic error
  return {
    statusCode: 500,
    message: 'An unexpected error occurred',
  };
}
