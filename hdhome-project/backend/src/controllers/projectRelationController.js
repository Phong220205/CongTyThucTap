import fs from 'node:fs/promises';
import path from 'node:path';
import { pool } from '../config/database.js';
import { env } from '../config/env.js';
import { canAccessProject } from '../services/projectAccessService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

async function requireProjectAccess(req) {
  if (!(await canAccessProject(req.user, req.params.id || req.params.projectId))) {
    throw new ApiError(403, 'Bạn không được truy cập dự án này.');
  }
}

export const listProjectEmployees = asyncHandler(async (req, res) => {
  await requireProjectAccess(req);
  const [rows] = await pool.execute(
    `SELECT pe.*, e.employee_code, e.full_name, e.position, e.department, e.email, e.phone
     FROM project_employees pe JOIN employees e ON e.employee_id = pe.employee_id
     WHERE pe.project_id = ? ORDER BY pe.assigned_date DESC`,
    [req.params.id],
  );
  sendSuccess(res, rows);
});

export const assignEmployee = asyncHandler(async (req, res) => {
  const [result] = await pool.execute(
    `INSERT INTO project_employees (project_id, employee_id, role_in_project, assigned_date, note)
     VALUES (?, ?, ?, ?, ?)`,
    [req.params.id, req.body.employee_id, req.body.role_in_project, req.body.assigned_date, req.body.note || null],
  );
  sendSuccess(res, { project_employee_id: result.insertId }, 'Phân công nhân sự thành công.', 201);
});

export const unassignEmployee = asyncHandler(async (req, res) => {
  const [result] = await pool.execute(
    'DELETE FROM project_employees WHERE project_id = ? AND employee_id = ?',
    [req.params.projectId, req.params.employeeId],
  );
  if (!result.affectedRows) throw new ApiError(404, 'Phân công không tồn tại.');
  sendSuccess(res, null, 'Hủy phân công thành công.');
});

export const listProjectMaterials = asyncHandler(async (req, res) => {
  await requireProjectAccess(req);
  const [rows] = await pool.execute(
    `SELECT pm.*, m.material_code, m.material_name, m.unit
     FROM project_materials pm JOIN materials m ON m.material_id = pm.material_id
     WHERE pm.project_id = ? ORDER BY m.material_name`,
    [req.params.id],
  );
  sendSuccess(res, rows);
});

export const addProjectMaterial = asyncHandler(async (req, res) => {
  const [result] = await pool.execute(
    `INSERT INTO project_materials (project_id, material_id, quantity, note)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), note = VALUES(note)`,
    [req.params.id, req.body.material_id, req.body.quantity, req.body.note || null],
  );
  sendSuccess(res, { project_material_id: result.insertId }, 'Thêm vật tư vào dự án thành công.', 201);
});

export const updateProjectMaterial = asyncHandler(async (req, res) => {
  const [result] = await pool.execute(
    'UPDATE project_materials SET quantity = ?, note = ? WHERE project_id = ? AND project_material_id = ?',
    [req.body.quantity, req.body.note || null, req.params.projectId, req.params.id],
  );
  if (!result.affectedRows) throw new ApiError(404, 'Vật tư dự án không tồn tại.');
  sendSuccess(res, null, 'Cập nhật vật tư dự án thành công.');
});

export const deleteProjectMaterial = asyncHandler(async (req, res) => {
  const [result] = await pool.execute(
    'DELETE FROM project_materials WHERE project_id = ? AND project_material_id = ?',
    [req.params.projectId, req.params.id],
  );
  if (!result.affectedRows) throw new ApiError(404, 'Vật tư dự án không tồn tại.');
  sendSuccess(res, null, 'Xóa vật tư dự án thành công.');
});

export const listProgress = asyncHandler(async (req, res) => {
  await requireProjectAccess(req);
  const [rows] = await pool.execute(
    `SELECT pu.*, u.full_name updated_by_name FROM progress_updates pu
     JOIN users u ON u.user_id = pu.updated_by
     WHERE pu.project_id = ? ORDER BY pu.updated_at DESC`,
    [req.params.id],
  );
  sendSuccess(res, rows);
});

export const addProgress = asyncHandler(async (req, res) => {
  await requireProjectAccess(req);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO progress_updates (project_id, progress_percent, title, note, image_path, updated_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.params.id, req.body.progress_percent, req.body.title, req.body.note || null, req.body.image_path || null, req.user.user_id],
    );
    await connection.execute('UPDATE projects SET progress = ? WHERE project_id = ?', [req.body.progress_percent, req.params.id]);
    await connection.commit();
    sendSuccess(res, { update_id: result.insertId }, 'Cập nhật tiến độ thành công.', 201);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

export const listFiles = asyncHandler(async (req, res) => {
  await requireProjectAccess(req);
  const [rows] = await pool.execute(
    `SELECT pf.*, u.full_name uploaded_by_name FROM project_files pf
     JOIN users u ON u.user_id = pf.uploaded_by
     WHERE pf.project_id = ? ORDER BY pf.uploaded_at DESC`,
    [req.params.id],
  );
  sendSuccess(res, rows);
});

export const uploadFile = asyncHandler(async (req, res) => {
  await requireProjectAccess(req);
  if (!req.file) throw new ApiError(422, 'Vui lòng chọn tệp cần upload.');
  const relativePath = path.relative(process.cwd(), req.file.path).replaceAll('\\', '/');
  const [result] = await pool.execute(
    `INSERT INTO project_files
      (project_id, file_name, original_name, file_path, file_type, mime_type, file_size, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.params.id, req.file.filename, req.file.originalname, relativePath, req.body.file_type || 'DRAWING', req.file.mimetype, req.file.size, req.user.user_id],
  );
  sendSuccess(res, { file_id: result.insertId, file_path: relativePath }, 'Upload bản vẽ thành công.', 201);
});

async function removeStoredFile(storedPath) {
  const absolute = path.resolve(storedPath);
  const uploadRoot = `${path.resolve(env.uploadDir)}${path.sep}`;
  if (!absolute.startsWith(uploadRoot)) return;
  try { await fs.unlink(absolute); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}

export const deleteFile = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute('SELECT file_path FROM project_files WHERE file_id = ?', [req.params.id]);
  if (!rows[0]) throw new ApiError(404, 'Tệp không tồn tại.');
  await pool.execute('DELETE FROM project_files WHERE file_id = ?', [req.params.id]);
  await removeStoredFile(rows[0].file_path);
  sendSuccess(res, null, 'Xóa tệp thành công.');
});

export const listImages = asyncHandler(async (req, res) => {
  await requireProjectAccess(req);
  const [rows] = await pool.execute(
    `SELECT pi.*, u.full_name uploaded_by_name FROM project_images pi
     JOIN users u ON u.user_id = pi.uploaded_by
     WHERE pi.project_id = ? ORDER BY pi.uploaded_at DESC`,
    [req.params.id],
  );
  sendSuccess(res, rows);
});

export const uploadImages = asyncHandler(async (req, res) => {
  await requireProjectAccess(req);
  const files = req.files || [];
  if (!files.length) throw new ApiError(422, 'Vui lòng chọn ít nhất một hình ảnh.');
  const imageFiles = files.filter((file) => file.mimetype.startsWith('image/'));
  if (imageFiles.length !== files.length) throw new ApiError(422, 'Gallery chỉ chấp nhận JPG, JPEG hoặc PNG.');
  const values = imageFiles.map((file) => [
    req.params.id, req.body.title || file.originalname, req.body.description || null,
    path.relative(process.cwd(), file.path).replaceAll('\\', '/'), req.user.user_id,
  ]);
  const placeholders = values.map(() => '(?, ?, ?, ?, ?)').join(', ');
  const [result] = await pool.execute(
    `INSERT INTO project_images (project_id, title, description, image_path, uploaded_by) VALUES ${placeholders}`,
    values.flat(),
  );
  sendSuccess(res, { uploaded: result.affectedRows }, 'Upload hình ảnh thành công.', 201);
});

export const deleteImage = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute('SELECT image_path FROM project_images WHERE image_id = ?', [req.params.id]);
  if (!rows[0]) throw new ApiError(404, 'Hình ảnh không tồn tại.');
  await pool.execute('DELETE FROM project_images WHERE image_id = ?', [req.params.id]);
  await removeStoredFile(rows[0].image_path);
  sendSuccess(res, null, 'Xóa hình ảnh thành công.');
});
