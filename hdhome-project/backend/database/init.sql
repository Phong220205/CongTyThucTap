-- ================================================================
-- HDHOME Project Management System — Database Initialization
-- Auto-executed by MariaDB container on first startup
-- ================================================================
-- NOTE: This file is mounted to /docker-entrypoint-initdb.d/
-- by the docker-compose.yml database service.
-- MariaDB entrypoint runs *.sql files in this directory alphabetically.
-- ================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- 1. SCHEMA (creates database, tables, indexes, constraints)
-- ----------------------------------------------------------
CREATE DATABASE IF NOT EXISTS hdhome_management
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hdhome_management;

DROP TABLE IF EXISTS progress_updates;
DROP TABLE IF EXISTS project_images;
DROP TABLE IF EXISTS project_files;
DROP TABLE IF EXISTS project_materials;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS project_employees;
DROP TABLE IF EXISTS contracts;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS investors;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS contact_requests;
DROP TABLE IF EXISTS roles;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE roles (
  role_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE customers (
  customer_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(120),
  address VARCHAR(255),
  note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customers_name (full_name),
  INDEX idx_customers_phone (phone)
) ENGINE=InnoDB;

CREATE TABLE investors (
  investor_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  organization VARCHAR(180),
  phone VARCHAR(20),
  email VARCHAR(120),
  address VARCHAR(255),
  note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_investors_name (full_name),
  INDEX idx_investors_organization (organization)
) ENGINE=InnoDB;

CREATE TABLE employees (
  employee_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  position VARCHAR(100),
  department VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(120),
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_employees_name (full_name),
  INDEX idx_employees_department (department)
) ENGINE=InnoDB;

CREATE TABLE users (
  user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120),
  phone VARCHAR(20),
  employee_id INT UNSIGNED NULL,
  role_id INT UNSIGNED NOT NULL,
  status ENUM('ACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id),
  CONSTRAINT fk_users_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL,
  UNIQUE KEY uq_users_employee (employee_id),
  INDEX idx_users_role_status (role_id, status)
) ENGINE=InnoDB;

CREATE TABLE projects (
  project_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_code VARCHAR(30) NOT NULL UNIQUE,
  project_name VARCHAR(180) NOT NULL,
  customer_id INT UNSIGNED NULL,
  investor_id INT UNSIGNED NULL,
  description TEXT,
  location VARCHAR(255),
  start_date DATE,
  expected_end_date DATE,
  actual_end_date DATE,
  status ENUM('PLANNING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLANNING',
  progress TINYINT UNSIGNED NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL,
  CONSTRAINT fk_projects_investor FOREIGN KEY (investor_id) REFERENCES investors(investor_id) ON DELETE SET NULL,
  CONSTRAINT chk_projects_progress CHECK (progress BETWEEN 0 AND 100),
  CONSTRAINT chk_projects_dates CHECK (expected_end_date IS NULL OR start_date IS NULL OR start_date <= expected_end_date),
  INDEX idx_projects_name (project_name),
  INDEX idx_projects_status_featured (status, featured),
  INDEX idx_projects_dates (start_date, expected_end_date)
) ENGINE=InnoDB;

CREATE TABLE contracts (
  contract_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  contract_number VARCHAR(60) NOT NULL UNIQUE,
  project_id INT UNSIGNED NOT NULL,
  customer_id INT UNSIGNED NULL,
  investor_id INT UNSIGNED NULL,
  signed_date DATE,
  start_date DATE,
  end_date DATE,
  contract_value DECIMAL(18,2) NOT NULL DEFAULT 0,
  status ENUM('DRAFT', 'SIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
  note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_contracts_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  CONSTRAINT fk_contracts_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL,
  CONSTRAINT fk_contracts_investor FOREIGN KEY (investor_id) REFERENCES investors(investor_id) ON DELETE SET NULL,
  INDEX idx_contracts_project (project_id),
  INDEX idx_contracts_status_date (status, signed_date)
) ENGINE=InnoDB;

CREATE TABLE project_employees (
  project_employee_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL,
  employee_id INT UNSIGNED NOT NULL,
  role_in_project VARCHAR(120) NOT NULL,
  assigned_date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_employees_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  CONSTRAINT fk_project_employees_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  UNIQUE KEY uq_project_employee_role (project_id, employee_id, role_in_project),
  INDEX idx_project_employees_employee (employee_id, project_id)
) ENGINE=InnoDB;

CREATE TABLE materials (
  material_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  material_code VARCHAR(30) NOT NULL UNIQUE,
  material_name VARCHAR(160) NOT NULL,
  unit VARCHAR(40) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_materials_name (material_name)
) ENGINE=InnoDB;

CREATE TABLE project_materials (
  project_material_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL,
  material_id INT UNSIGNED NOT NULL,
  quantity DECIMAL(14,2) NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_materials_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  CONSTRAINT fk_project_materials_material FOREIGN KEY (material_id) REFERENCES materials(material_id) ON DELETE RESTRICT,
  UNIQUE KEY uq_project_material (project_id, material_id)
) ENGINE=InnoDB;

CREATE TABLE project_files (
  file_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL DEFAULT 'DRAWING',
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT UNSIGNED NOT NULL,
  uploaded_by INT UNSIGNED NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_files_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  CONSTRAINT fk_project_files_user FOREIGN KEY (uploaded_by) REFERENCES users(user_id),
  INDEX idx_project_files_project (project_id, uploaded_at)
) ENGINE=InnoDB;

CREATE TABLE project_images (
  image_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL,
  title VARCHAR(180),
  description TEXT,
  image_path VARCHAR(500) NOT NULL,
  uploaded_by INT UNSIGNED NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_images_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  CONSTRAINT fk_project_images_user FOREIGN KEY (uploaded_by) REFERENCES users(user_id),
  INDEX idx_project_images_project (project_id, uploaded_at)
) ENGINE=InnoDB;

CREATE TABLE progress_updates (
  update_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL,
  progress_percent TINYINT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  note TEXT,
  image_path VARCHAR(500),
  updated_by INT UNSIGNED NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_progress_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  CONSTRAINT fk_progress_user FOREIGN KEY (updated_by) REFERENCES users(user_id),
  CONSTRAINT chk_progress_percent CHECK (progress_percent BETWEEN 0 AND 100),
  INDEX idx_progress_project_date (project_id, updated_at)
) ENGINE=InnoDB;

CREATE TABLE contact_requests (
  contact_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(120),
  subject VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('NEW', 'CONTACTED', 'CLOSED') NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contacts_status_date (status, created_at),
  INDEX idx_contacts_name (full_name)
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 2. SEED DATA (demo accounts, projects, employees, etc.)
-- ----------------------------------------------------------
USE hdhome_management;
START TRANSACTION;

INSERT INTO roles (role_id, role_name, description) VALUES
  (1, 'ADMIN', 'Quản trị viên toàn hệ thống'),
  (2, 'PROJECT_MANAGER', 'Quản lý dự án và các nghiệp vụ liên quan'),
  (3, 'TECHNICAL_STAFF', 'Nhân viên kỹ thuật phụ trách dự án được phân công');

INSERT INTO customers (customer_id, full_name, phone, email, address, note) VALUES
  (1, 'Khách hàng Demo 01', '0900000001', 'customer01@example.com', 'Thanh Khê, Đà Nẵng', 'Thông tin minh họa'),
  (2, 'Khách hàng Demo 02', '0900000002', 'customer02@example.com', 'Hải Châu, Đà Nẵng', 'Thông tin minh họa'),
  (3, 'Khách hàng Demo 03', '0900000003', 'customer03@example.com', 'Liên Chiểu, Đà Nẵng', 'Thông tin minh họa'),
  (4, 'Khách hàng Demo 04', '0900000004', 'customer04@example.com', 'Sơn Trà, Đà Nẵng', 'Thông tin minh họa'),
  (5, 'Khách hàng Demo 05', '0900000005', 'customer05@example.com', 'Cẩm Lệ, Đà Nẵng', 'Thông tin minh họa'),
  (6, 'Khách hàng Demo 06', '0900000006', 'customer06@example.com', 'Ngũ Hành Sơn, Đà Nẵng', 'Thông tin minh họa');

INSERT INTO investors (investor_id, full_name, organization, phone, email, address, note) VALUES
  (1, 'Đại diện Demo A', 'Chủ đầu tư Minh họa A', '0910000001', 'investor01@example.com', 'Đà Nẵng', 'Dữ liệu demo'),
  (2, 'Đại diện Demo B', 'Chủ đầu tư Minh họa B', '0910000002', 'investor02@example.com', 'Đà Nẵng', 'Dữ liệu demo'),
  (3, 'Đại diện Demo C', 'Chủ đầu tư Minh họa C', '0910000003', 'investor03@example.com', 'Quảng Nam', 'Dữ liệu demo'),
  (4, 'Đại diện Demo D', 'Chủ đầu tư Minh họa D', '0910000004', 'investor04@example.com', 'Huế', 'Dữ liệu demo'),
  (5, 'Đại diện Demo E', 'Chủ đầu tư Minh họa E', '0910000005', 'investor05@example.com', 'Đà Nẵng', 'Dữ liệu demo');

INSERT INTO employees (employee_id, employee_code, full_name, position, department, phone, email, status) VALUES
  (1, 'NV001', 'Nguyễn Văn Demo 01', 'Giám đốc dự án', 'Quản lý', '0920000001', 'employee01@example.com', 'ACTIVE'),
  (2, 'NV002', 'Trần Thị Demo 02', 'Quản lý dự án', 'Quản lý dự án', '0920000002', 'employee02@example.com', 'ACTIVE'),
  (3, 'NV003', 'Lê Văn Demo 03', 'Kiến trúc sư', 'Thiết kế', '0920000003', 'employee03@example.com', 'ACTIVE'),
  (4, 'NV004', 'Phạm Thị Demo 04', 'Thiết kế nội thất', 'Thiết kế', '0920000004', 'employee04@example.com', 'ACTIVE'),
  (5, 'NV005', 'Hoàng Văn Demo 05', 'Kỹ sư xây dựng', 'Kỹ thuật', '0920000005', 'employee05@example.com', 'ACTIVE'),
  (6, 'NV006', 'Võ Thị Demo 06', 'Kỹ sư điện nước', 'Kỹ thuật', '0920000006', 'employee06@example.com', 'ACTIVE'),
  (7, 'NV007', 'Đặng Văn Demo 07', 'Giám sát công trình', 'Thi công', '0920000007', 'employee07@example.com', 'ACTIVE'),
  (8, 'NV008', 'Bùi Thị Demo 08', 'Nhân viên vật tư', 'Vật tư', '0920000008', 'employee08@example.com', 'ACTIVE'),
  (9, 'NV009', 'Đỗ Văn Demo 09', 'Kế toán hợp đồng', 'Tài chính', '0920000009', 'employee09@example.com', 'ACTIVE'),
  (10, 'NV010', 'Nhân viên Kỹ thuật Demo', 'Kỹ thuật hiện trường', 'Kỹ thuật', '0920000010', 'technical@example.com', 'ACTIVE');

INSERT INTO users (user_id, username, password_hash, full_name, email, phone, employee_id, role_id, status) VALUES
  (1, 'admin', '$2b$10$B83GLGTHVIbwSvetyub4vuTn9JtUEU4..PJxIA7i/y./37gwq57jK', 'Quản trị viên Demo', 'admin@example.com', '0930000001', 1, 1, 'ACTIVE'),
  (2, 'projectmanager', '$2b$10$KUtYCBrLQ7JCAtm78rC2BuszVlBJf4hv/sQjDGHqKcpbkyVNFVC3a', 'Quản lý Dự án Demo', 'manager@example.com', '0930000002', 2, 2, 'ACTIVE'),
  (3, 'technical', '$2b$10$DH2I5iLYvBjDnccz7YwVnOk6tCIOuJqBdYi5sM./FjVjA4E4s7GnW', 'Nhân viên Kỹ thuật Demo', 'technical@example.com', '0930000003', 10, 3, 'ACTIVE');

INSERT INTO projects (project_id, project_code, project_name, customer_id, investor_id, description, location, start_date, expected_end_date, actual_end_date, status, progress, featured) VALUES
  (1, 'A01', 'Nhà phố hiện đại A01', 1, 1, 'Thiết kế và thi công nhà phố hiện đại, tối ưu ánh sáng tự nhiên.', 'Thanh Khê, Đà Nẵng', '2026-01-10', '2026-08-30', NULL, 'IN_PROGRESS', 68, TRUE),
  (2, 'B02', 'Nhà ở gia đình B02', 2, 2, 'Không gian sống gia đình với công năng gọn gàng và bền vững.', 'Hải Châu, Đà Nẵng', '2025-07-01', '2026-02-28', '2026-02-20', 'COMPLETED', 100, TRUE),
  (3, 'C03', 'Biệt thự sân vườn C03', 3, 3, 'Biệt thự sân vườn kết nối mảng xanh và không gian sinh hoạt.', 'Ngũ Hành Sơn, Đà Nẵng', '2026-03-15', '2027-01-15', NULL, 'IN_PROGRESS', 42, TRUE),
  (4, 'D04', 'Cải tạo nhà phố D04', 4, 4, 'Cải tạo mặt tiền, nội thất và hệ thống điện nước hiện hữu.', 'Sơn Trà, Đà Nẵng', '2026-05-05', '2026-10-10', NULL, 'IN_PROGRESS', 25, TRUE),
  (5, 'E05', 'Nhà phố 3 tầng E05', 5, 5, 'Hồ sơ thiết kế nhà phố ba tầng theo nhu cầu gia đình.', 'Cẩm Lệ, Đà Nẵng', '2026-09-01', '2027-04-30', NULL, 'PLANNING', 5, TRUE),
  (6, 'F06', 'Công trình dân dụng F06', 6, 1, 'Công trình dân dụng quy mô vừa, dữ liệu phục vụ minh họa.', 'Liên Chiểu, Đà Nẵng', '2025-10-01', '2026-05-30', NULL, 'PAUSED', 55, FALSE);

INSERT INTO contracts (contract_id, contract_number, project_id, customer_id, investor_id, signed_date, start_date, end_date, contract_value, status, note) VALUES
  (1, 'HD-A01-2026', 1, 1, 1, '2026-01-05', '2026-01-10', '2026-08-30', 1850000000, 'IN_PROGRESS', 'Giá trị hợp đồng minh họa'),
  (2, 'HD-B02-2025', 2, 2, 2, '2025-06-20', '2025-07-01', '2026-02-28', 1260000000, 'COMPLETED', 'Giá trị hợp đồng minh họa'),
  (3, 'HD-C03-2026', 3, 3, 3, '2026-03-01', '2026-03-15', '2027-01-15', 3280000000, 'IN_PROGRESS', 'Giá trị hợp đồng minh họa'),
  (4, 'HD-D04-2026', 4, 4, 4, '2026-04-25', '2026-05-05', '2026-10-10', 780000000, 'IN_PROGRESS', 'Giá trị hợp đồng minh họa'),
  (5, 'HD-E05-2026', 5, 5, 5, NULL, '2026-09-01', '2027-04-30', 2100000000, 'DRAFT', 'Giá trị hợp đồng minh họa');

INSERT INTO materials (material_id, material_code, material_name, unit, description) VALUES
  (1, 'VT001', 'Xi măng PCB40', 'Bao', 'Vật tư minh họa'),
  (2, 'VT002', 'Cát xây tô', 'm³', 'Vật tư minh họa'),
  (3, 'VT003', 'Đá 1x2', 'm³', 'Vật tư minh họa'),
  (4, 'VT004', 'Thép D16', 'Kg', 'Vật tư minh họa'),
  (5, 'VT005', 'Gạch xây', 'Viên', 'Vật tư minh họa'),
  (6, 'VT006', 'Sơn nội thất', 'Thùng', 'Vật tư minh họa'),
  (7, 'VT007', 'Ống cấp nước', 'Mét', 'Vật tư minh họa'),
  (8, 'VT008', 'Dây điện 2.5 mm', 'Mét', 'Vật tư minh họa'),
  (9, 'VT009', 'Gạch lát nền', 'm²', 'Vật tư minh họa'),
  (10, 'VT010', 'Kính cường lực', 'm²', 'Vật tư minh họa');

INSERT INTO project_employees (project_id, employee_id, role_in_project, assigned_date, note) VALUES
  (1, 2, 'Quản lý dự án', '2026-01-05', NULL),
  (1, 5, 'Kỹ sư xây dựng', '2026-01-10', NULL),
  (1, 10, 'Kỹ thuật hiện trường', '2026-01-12', 'Tài khoản technical được phân công dự án này'),
  (2, 3, 'Kiến trúc sư', '2025-06-25', NULL),
  (3, 2, 'Quản lý dự án', '2026-03-01', NULL),
  (3, 7, 'Giám sát công trình', '2026-03-15', NULL),
  (3, 10, 'Kỹ thuật hiện trường', '2026-03-20', NULL),
  (4, 4, 'Thiết kế nội thất', '2026-04-28', NULL),
  (5, 6, 'Kỹ sư điện nước', '2026-08-20', NULL);

INSERT INTO project_materials (project_id, material_id, quantity, note) VALUES
  (1, 1, 420, 'Theo dự toán giai đoạn kết cấu'),
  (1, 4, 3850, 'Thép phần móng và thân'),
  (1, 5, 18500, 'Gạch xây tường'),
  (3, 2, 210, NULL),
  (3, 3, 180, NULL),
  (3, 10, 125, 'Khu vực mặt tiền'),
  (4, 6, 32, 'Hoàn thiện nội thất'),
  (5, 7, 460, NULL);

INSERT INTO progress_updates (project_id, progress_percent, title, note, updated_by, updated_at) VALUES
  (1, 10, 'Hoàn thành chuẩn bị mặt bằng', 'Đã hoàn tất công tác chuẩn bị.', 2, '2026-01-20 08:00:00'),
  (1, 30, 'Hoàn thành phần móng', 'Kiểm tra chất lượng đạt yêu cầu.', 2, '2026-03-01 09:00:00'),
  (1, 50, 'Thi công phần thân', 'Đang triển khai tầng hai.', 3, '2026-05-15 10:00:00'),
  (1, 68, 'Bắt đầu hoàn thiện', 'Thi công tô trát và điện nước.', 3, '2026-07-20 14:00:00'),
  (2, 35, 'Hoàn thành kết cấu', 'Dữ liệu tiến độ minh họa.', 2, '2025-09-10 08:30:00'),
  (2, 75, 'Hoàn thiện nội thất', 'Dữ liệu tiến độ minh họa.', 2, '2025-12-18 09:30:00'),
  (2, 100, 'Nghiệm thu hoàn thành', 'Công trình đã hoàn thành.', 1, '2026-02-20 16:00:00'),
  (3, 20, 'Hoàn thành phần móng', 'Đã nghiệm thu nội bộ.', 2, '2026-05-20 11:00:00'),
  (3, 42, 'Thi công tầng một', 'Tiến độ đúng kế hoạch.', 3, '2026-07-25 15:00:00'),
  (4, 25, 'Tháo dỡ và gia cố', 'Hoàn thành gia cố kết cấu cũ.', 2, '2026-07-10 13:00:00');

INSERT INTO contact_requests (full_name, phone, email, subject, message, status) VALUES
  ('Khách Liên hệ Demo', '0940000001', 'contact@example.com', 'Tư vấn thiết kế nhà phố', 'Tôi cần thông tin minh họa về quy trình tư vấn.', 'NEW'),
  ('Khách Liên hệ Minh họa', '0940000002', NULL, 'Tư vấn cải tạo', 'Yêu cầu dùng cho dữ liệu demo.', 'CONTACTED');

COMMIT;
