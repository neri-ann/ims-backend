import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Authorization middleware - enforces role-based access control
 * 
 * Usage: authorize('USER', 'ADMIN')
 * 
 * Checks if user has the required role.
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // Check if user's role matches any of the allowed roles (case-insensitive)
    const userRole = (req.user.role || '').toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
    let hasPermission = normalizedAllowedRoles.includes(userRole);

    // Additional check: If user role is 'user' and inventory_manager access is allowed,
    // check if user's positionName includes 'Inventory Manager'
    if (!hasPermission && userRole === 'user' && normalizedAllowedRoles.includes('inventory_manager')) {
      const positionNames = req.user.positionName || [];
      const hasInventoryManagerPosition = positionNames.some(
        (position) => position.toLowerCase() === 'inventory manager'
      );
      if (hasInventoryManagerPosition) {
        hasPermission = true;
      }
    }

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredRoles: allowedRoles,
        userRole: userRole,
      });
      return;
    }

    next();
  };
};


