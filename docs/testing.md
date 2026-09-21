# Kịch bản kiểm thử HDHOME

## Tự động

Trong `backend`:

```bash
npm test
```

Test tự động kiểm tra bcrypt, dữ liệu login bắt buộc, ma trận quyền, validation dự án và validation tiến độ.

## Kiểm thử tích hợp đề xuất

### 1. Login và JWT

1. Login `admin / Admin@123`: nhận token, chuyển đến dashboard.
2. Login sai mật khẩu: HTTP 401, không lưu token.
3. Gọi `/api/auth/me` không có token: HTTP 401.
4. Khóa user rồi dùng token cũ: HTTP 401.

### 2. Projects CRUD

1. ADMIN tạo dự án hợp lệ: HTTP 201 và có trong MySQL.
2. Tạo dự án thiếu tên: HTTP 422.
3. Ngày bắt đầu lớn hơn ngày kết thúc: HTTP 422.
4. Tìm theo tên/mã/địa điểm gọi API và trả pagination đúng.
5. Chỉnh sửa dự án: dữ liệu tải cũ và cập nhật thành công.
6. Xóa dự án: giao diện bắt buộc xác nhận trước khi gọi API.

### 3. Permission

1. PROJECT_MANAGER gọi `/api/users`: HTTP 403.
2. TECHNICAL_STAFF gọi `/api/roles`: HTTP 403.
3. TECHNICAL_STAFF chỉ thấy dự án 1 và 3 được seed phân công.
4. TECHNICAL_STAFF truy cập ID dự án khác: HTTP 403.
5. Menu frontend không hiển thị Người dùng/Vai trò với user không phải ADMIN.

### 4. Progress update

1. Cập nhật 75%: thêm một dòng `progress_updates` và `projects.progress = 75`.
2. Timeline vẫn còn bản ghi cũ.
3. Nhập -1 hoặc 101: HTTP 422.
4. Kiểm tra transaction: nếu insert lỗi, phần trăm trong `projects` không đổi.

### 5. Upload

1. Upload PDF/JPG/JPEG/PNG dưới 10 MB: thành công.
2. Upload định dạng khác hoặc trên 10 MB: HTTP 422.
3. File nằm tại `backend/uploads/projects/{projectId}/`; database chỉ lưu đường dẫn.
4. Xóa file qua modal: xóa metadata và file trên ổ đĩa.

### 6. Responsive

Kiểm tra các kích thước 1920, 1366, 1024, 768 và 390 px: sidebar desktop, drawer mobile, bảng có scroll ngang, form một cột trên màn hình nhỏ.
