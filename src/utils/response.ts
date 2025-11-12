import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';
import { HTTP_STATUS } from '../constants';

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = HTTP_STATUS.OK
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  error?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 */
export const sendValidationError = (
  res: Response,
  errors: Array<{ field: string; message: string }>
): Response => {
  const response: ApiResponse = {
    success: false,
    message: 'Validation error',
    errors,
  };
  return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginatedResponse = <T>(
  res: Response,
  message: string,
  data: T[],
  meta: { page: number; limit: number; total: number; totalPages: number }
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    meta,
  };
  return res.status(HTTP_STATUS.OK).json(response);
};
