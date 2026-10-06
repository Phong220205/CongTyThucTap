import { ApiError } from '../utils/ApiError.js';
import { hasPermission } from '../utils/permissions.js';

export const authorizeRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role_name)) {
    return next(new ApiError(403, 'Bạn không có quyền thực hiện thao tác này.'));
  }
  next();
};

export const authorizePermission = (permission) => (req, _res, next) => {
  if (!req.user || !hasPermission(req.user.role_name, permission)) {
    return next(new ApiError(403, 'Bạn không có quyền thực hiện thao tác này.'));
  }
  next();
};
