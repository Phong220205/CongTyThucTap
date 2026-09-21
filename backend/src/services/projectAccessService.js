import { pool } from '../config/database.js';
import { ROLES } from '../utils/permissions.js';

export async function canAccessProject(user, projectId) {
  if (user.role_name !== ROLES.TECHNICAL_STAFF) return true;
  if (!user.employee_id) return false;
  const [rows] = await pool.execute(
    'SELECT 1 FROM project_employees WHERE project_id = ? AND employee_id = ? LIMIT 1',
    [projectId, user.employee_id],
  );
  return Boolean(rows[0]);
}

export function projectListScope(req) {
  if (req.user.role_name !== ROLES.TECHNICAL_STAFF) return {};
  return {
    scopeSql: `EXISTS (
      SELECT 1 FROM project_employees pe
      WHERE pe.project_id = p.project_id AND pe.employee_id = ?
    )`,
    scopeParams: [req.user.employee_id || 0],
  };
}
