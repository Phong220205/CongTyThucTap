-- HDHOME Seed Data
-- Default roles + admin user (admin/admin123)
-- Password hash of "admin123" với bcrypt cost 10

INSERT INTO `roles` (`role_name`, `description`) VALUES
  ('ADMIN', 'Quản trị viên hệ thống - toàn quyền'),
  ('PROJECT_MANAGER', 'Quản lý dự án - CRUD projects/contracts/...'),
  ('TECHNICAL_STAFF', 'Nhân viên kỹ thuật - chỉ dự án được phân công')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- admin user (password: admin123)
-- Hash này được sinh bằng bcrypt cost 10 với password "admin123"
INSERT INTO `users` (`username`, `password_hash`, `full_name`, `email`, `phone`, `role_id`, `status`)
SELECT 'admin', '$2b$10$e9phMGGypTkPqrxJCQSYpukUsTGr9HobpzmWvHTM8pvpu0IqhKnqm', 'Quản trị viên', 'admin@hdhome.local', '0900000000', r.role_id, 'ACTIVE'
FROM `roles` r WHERE r.role_name = 'ADMIN'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- projectmanager user (password: Manager@123)
INSERT INTO `users` (`username`, `password_hash`, `full_name`, `email`, `phone`, `role_id`, `status`)
SELECT 'projectmanager', '$2b$10$JyGZgr1xnB6CTTKioSdcZ.DNzzaOjFWpSO1t7.MDvQe/pbD2HavL6', 'Trần Quản Lý', 'projectmanager@hdhome.local', '0901111111', r.role_id, 'ACTIVE'
FROM `roles` r WHERE r.role_name = 'PROJECT_MANAGER'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- technical user (password: Technical@123)
INSERT INTO `users` (`username`, `password_hash`, `full_name`, `email`, `phone`, `role_id`, `status`)
SELECT 'technical', '$2b$10$1G7BR2K8JEFCsUPQ04Kn7OexjwvIN0rzCGyWEp/KPTzarslO35702', 'Nguyễn Kỹ Thuật', 'technical@hdhome.local', '0902222222', r.role_id, 'ACTIVE'
FROM `roles` r WHERE r.role_name = 'TECHNICAL_STAFF'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- Sample data để test (optional - có thể xóa)
INSERT INTO `customers` (`full_name`, `phone`, `email`, `address`) VALUES
  ('Nguyễn Văn A', '0901111111', 'a@example.com', 'Hà Nội'),
  ('Trần Thị B', '0902222222', 'b@example.com', 'TP HCM');

INSERT INTO `investors` (`full_name`, `organization`, `phone`, `email`) VALUES
  ('Lê Văn C', 'Công ty Đầu tư XYZ', '0903333333', 'c@example.com');

INSERT INTO `employees` (`employee_code`, `full_name`, `position`, `department`, `phone`, `email`, `status`) VALUES
  ('NV001', 'Phạm Văn D', 'Kiến trúc sư', 'Thiết kế', '0904444444', 'd@example.com', 'ACTIVE'),
  ('NV002', 'Hoàng Thị E', 'Kỹ sư xây dựng', 'Thi công', '0905555555', 'e@example.com', 'ACTIVE');

INSERT INTO `materials` (`material_code`, `material_name`, `unit`, `description`) VALUES
  ('MT001', 'Xi măng PCB40', 'bao', 'Xi măng poóc-lăng'),
  ('MT002', 'Thép phi 12', 'cây', 'Thép cây D12'),
  ('MT003', 'Gạch ống', 'viên', 'Gạch đất nung');
