# Cơ sở dữ liệu HDHOME

Database sử dụng MySQL 8+, tên `hdhome_management`, mã hóa `utf8mb4`.

## Nhóm bảng

| Nhóm | Bảng | Mục đích |
|---|---|---|
| Bảo mật | `roles`, `users` | Tài khoản, vai trò và trạng thái khóa/mở |
| Đối tác | `customers`, `investors` | Khách hàng và chủ đầu tư |
| Nhân sự | `employees`, `project_employees` | Hồ sơ nhân sự và phân công theo dự án |
| Dự án | `projects`, `contracts` | Thông tin chính và hợp đồng |
| Vật tư | `materials`, `project_materials` | Danh mục và khối lượng theo dự án |
| Hồ sơ | `project_files`, `project_images` | Metadata tệp, ảnh; dữ liệu file nằm trên ổ đĩa |
| Tiến độ | `progress_updates` | Lịch sử cập nhật, không ghi đè bản ghi cũ |
| Website | `contact_requests` | Yêu cầu tư vấn từ trang công khai |

## Quan hệ chính

- `users.role_id → roles.role_id`.
- `users.employee_id → employees.employee_id`: trường bổ sung để liên kết tài khoản kỹ thuật với hồ sơ nhân sự và kiểm tra dự án được phân công.
- `projects.customer_id → customers.customer_id`.
- `projects.investor_id → investors.investor_id`.
- `project_employees` có khóa duy nhất `(project_id, employee_id, role_in_project)` để chống phân công trùng.
- `project_materials` có khóa duy nhất `(project_id, material_id)`.
- `progress_updates` lưu từng lần cập nhật; API dùng transaction để vừa thêm lịch sử, vừa cập nhật `projects.progress`.

## Cài dữ liệu

```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p hdhome_management < backend/database/seed.sql
```

`schema.sql` xóa và tạo lại các bảng trong database mục tiêu. Chỉ chạy trên database demo hoặc môi trường phát triển.

## Dữ liệu demo

Seed gồm 3 vai trò, 3 tài khoản, 6 dự án, 6 khách hàng, 5 chủ đầu tư, 10 nhân sự, 10 vật tư, 5 hợp đồng và 10 bản ghi tiến độ. Toàn bộ tên và thông tin liên hệ ngoài dữ liệu công ty được ghi rõ là minh họa.
