import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import { hasPermission, ROLES } from '../src/utils/permissions.js';
import { validateLogin, validateProgress, validateProject } from '../src/validators/resourceValidators.js';

test('mật khẩu tài khoản demo được hash bằng bcrypt', async () => {
  const hash = '$2b$10$B83GLGTHVIbwSvetyub4vuTn9JtUEU4..PJxIA7i/y./37gwq57jK';
  assert.equal(await bcrypt.compare('Admin@123', hash), true);
  assert.equal(await bcrypt.compare('sai-mat-khau', hash), false);
});

test('validation đăng nhập yêu cầu đủ username và password', () => {
  assert.equal(validateLogin({ username: 'admin', password: 'Admin@123' }).length, 0);
  assert.equal(validateLogin({ username: '', password: '' }).length, 2);
});

test('phân quyền chặn TECHNICAL_STAFF quản lý users và roles', () => {
  assert.equal(hasPermission(ROLES.ADMIN, 'users:delete'), true);
  assert.equal(hasPermission(ROLES.PROJECT_MANAGER, 'projects:update'), true);
  assert.equal(hasPermission(ROLES.TECHNICAL_STAFF, 'users:create'), false);
  assert.equal(hasPermission(ROLES.TECHNICAL_STAFF, 'progress:create'), true);
});

test('validation dự án kiểm tra tên, tiến độ và ngày', () => {
  const request = { method: 'POST' };
  assert.equal(validateProject({ project_code: 'A01', project_name: 'Nhà phố', progress: 50 }, request).length, 0);
  assert.ok(validateProject({ project_code: '', project_name: '', progress: 101 }, request).length >= 3);
  assert.ok(validateProject({ project_code: 'A01', project_name: 'Nhà phố', progress: 50, start_date: '2026-12-01', expected_end_date: '2026-01-01' }, request).some((message) => message.includes('Ngày bắt đầu')));
});

test('cập nhật tiến độ chỉ nhận giá trị 0 đến 100 và có tiêu đề', () => {
  assert.equal(validateProgress({ progress_percent: 80, title: 'Hoàn thiện' }).length, 0);
  assert.equal(validateProgress({ progress_percent: -1, title: '' }).length, 2);
});
