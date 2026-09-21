import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) throw new ApiError(401, 'Vui lòng đăng nhập để tiếp tục.');

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
  }

  const [rows] = await pool.execute(
    `SELECT u.user_id, u.username, u.full_name, u.email, u.phone, u.employee_id,
            u.status, r.role_id, r.role_name
     FROM users u JOIN roles r ON r.role_id = u.role_id
     WHERE u.user_id = ? LIMIT 1`,
    [payload.sub],
  );
  const user = rows[0];
  if (!user || user.status !== 'ACTIVE') throw new ApiError(401, 'Tài khoản không tồn tại hoặc đã bị khóa.');

  req.user = user;
  next();
});
