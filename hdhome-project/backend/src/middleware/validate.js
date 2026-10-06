import { ApiError } from '../utils/ApiError.js';

export const validate = (validator) => (req, _res, next) => {
  const errors = validator(req.body, req);
  if (errors.length) return next(new ApiError(422, 'Dữ liệu không hợp lệ.', errors));
  next();
};
