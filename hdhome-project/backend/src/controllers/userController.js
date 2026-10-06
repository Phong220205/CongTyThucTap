import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination, paginationMeta } from '../utils/pagination.js';
import { sendSuccess } from '../utils/response.js';

const userSelect = `SELECT u.user_id, u.username, u.full_name, u.email, u.phone, u.employee_id,
  u.status, u.role_id, r.role_name, u.created_at, u.updated_at
  FROM users u JOIN roles r ON r.role_id = u.role_id`;

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const search = `%${req.query.search || ''}%`;
  const [count] = await pool.execute(
    'SELECT COUNT(*) total FROM users WHERE username LIKE ? OR full_name LIKE ? OR email LIKE ?',
    [search, search, search],
  );
  const [rows] = await pool.execute(
    `${userSelect} WHERE u.username LIKE ? OR u.full_name LIKE ? OR u.email LIKE ?
     ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
    [search, search, search, limit, offset],
  );
  sendSuccess(res, rows, 'Lấy danh sách thành công.', 200, { pagination: paginationMeta(page, limit, count[0].total) });
});

export const getUser = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(`${userSelect} WHERE u.user_id = ?`, [req.params.id]);
  if (!rows[0]) throw new ApiError(404, 'Người dùng không tồn tại.');
  sendSuccess(res, rows[0]);
});

export const createUser = asyncHandler(async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const [result] = await pool.execute(
    `INSERT INTO users (username, password_hash, full_name, email, phone, employee_id, role_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.body.username, passwordHash, req.body.full_name, req.body.email || null, req.body.phone || null,
      req.body.employee_id || null, req.body.role_id, req.body.status || 'ACTIVE'],
  );
  const [rows] = await pool.execute(`${userSelect} WHERE u.user_id = ?`, [result.insertId]);
  sendSuccess(res, rows[0], 'Tạo tài khoản thành công.', 201);
});

export const updateUser = asyncHandler(async (req, res) => {
  const fields = ['full_name', 'email', 'phone', 'employee_id', 'role_id', 'status'];
  const data = Object.fromEntries(fields.filter((field) => field in req.body).map((field) => [field, req.body[field] || null]));
  if (!Object.keys(data).length) throw new ApiError(422, 'Không có dữ liệu cần cập nhật.');
  await pool.execute(
    `UPDATE users SET ${Object.keys(data).map((field) => `${field} = ?`).join(', ')} WHERE user_id = ?`,
    [...Object.values(data), req.params.id],
  );
  const [rows] = await pool.execute(`${userSelect} WHERE u.user_id = ?`, [req.params.id]);
  if (!rows[0]) throw new ApiError(404, 'Người dùng không tồn tại.');
  sendSuccess(res, rows[0], 'Cập nhật người dùng thành công.');
});

export const resetPassword = asyncHandler(async (req, res) => {
  if (!req.body.password || req.body.password.length < 8) throw new ApiError(422, 'Mật khẩu mới phải có ít nhất 8 ký tự.');
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const [result] = await pool.execute('UPDATE users SET password_hash = ? WHERE user_id = ?', [passwordHash, req.params.id]);
  if (!result.affectedRows) throw new ApiError(404, 'Người dùng không tồn tại.');
  sendSuccess(res, null, 'Đặt lại mật khẩu thành công.');
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (Number(req.params.id) === req.user.user_id) throw new ApiError(409, 'Bạn không thể xóa chính tài khoản đang đăng nhập.');
  const [result] = await pool.execute('DELETE FROM users WHERE user_id = ?', [req.params.id]);
  if (!result.affectedRows) throw new ApiError(404, 'Người dùng không tồn tại.');
  sendSuccess(res, null, 'Xóa người dùng thành công.');
});
