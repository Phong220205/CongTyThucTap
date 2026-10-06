import { pool } from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { permissions } from '../utils/permissions.js';
import { sendSuccess } from '../utils/response.js';

export const listRoles = asyncHandler(async (_req, res) => {
  const [rows] = await pool.execute('SELECT * FROM roles ORDER BY role_id');
  sendSuccess(res, rows.map((role) => ({ ...role, permissions: permissions[role.role_name] || [] })));
});

export const createRole = asyncHandler(async (req, res) => {
  if (!req.body.role_name) throw new ApiError(422, 'Tên vai trò là bắt buộc.');
  const [result] = await pool.execute('INSERT INTO roles (role_name, description) VALUES (?, ?)', [req.body.role_name, req.body.description || null]);
  const [rows] = await pool.execute('SELECT * FROM roles WHERE role_id = ?', [result.insertId]);
  sendSuccess(res, rows[0], 'Thêm vai trò thành công.', 201);
});

export const updateRole = asyncHandler(async (req, res) => {
  const [result] = await pool.execute('UPDATE roles SET description = ? WHERE role_id = ?', [req.body.description || null, req.params.id]);
  if (!result.affectedRows) throw new ApiError(404, 'Vai trò không tồn tại.');
  const [rows] = await pool.execute('SELECT * FROM roles WHERE role_id = ?', [req.params.id]);
  sendSuccess(res, rows[0], 'Cập nhật vai trò thành công.');
});

export const deleteRole = asyncHandler(async (req, res) => {
  const [roles] = await pool.execute('SELECT role_name FROM roles WHERE role_id = ?', [req.params.id]);
  if (!roles[0]) throw new ApiError(404, 'Vai trò không tồn tại.');
  if (['ADMIN', 'PROJECT_MANAGER', 'TECHNICAL_STAFF'].includes(roles[0].role_name)) {
    throw new ApiError(409, 'Không thể xóa vai trò mặc định của hệ thống.');
  }
  const [usage] = await pool.execute('SELECT COUNT(*) total FROM users WHERE role_id = ?', [req.params.id]);
  if (usage[0].total) throw new ApiError(409, 'Không thể xóa vai trò đang có người dùng.');
  await pool.execute('DELETE FROM roles WHERE role_id = ?', [req.params.id]);
  sendSuccess(res, null, 'Xóa vai trò thành công.');
});
