# REST API HDHOME

Base URL mặc định: `http://localhost:5000/api`.

## Format phản hồi

```json
{
  "success": true,
  "message": "Thành công",
  "data": {}
}
```

Danh sách có thêm:

```json
{
  "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
}
```

## Công khai

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/health` | Kiểm tra API và MySQL |
| GET | `/public/projects` | Dự án có `featured = true` |
| GET | `/public/projects/:id` | Chi tiết dự án công khai |
| POST | `/public/contacts` | Gửi yêu cầu tư vấn |

## Xác thực

| Method | Endpoint |
|---|---|
| POST | `/auth/login` |
| GET | `/auth/me` |
| POST | `/auth/logout` |

Các API nội bộ nhận header `Authorization: Bearer <token>`.

## CRUD nội bộ

Các resource `projects`, `customers`, `investors`, `employees`, `materials`, `contracts` hỗ trợ:

- `GET /api/{resource}?page=1&limit=10&search=&status=&sort=`
- `GET /api/{resource}/:id`
- `POST /api/{resource}`
- `PUT /api/{resource}/:id`
- `DELETE /api/{resource}/:id`

## Nghiệp vụ dự án

| Method | Endpoint | Mô tả |
|---|---|---|
| GET/POST | `/projects/:id/employees` | Xem/phân công nhân sự |
| DELETE | `/projects/:projectId/employees/:employeeId` | Hủy phân công |
| GET/POST | `/projects/:id/materials` | Vật tư dự án |
| PUT/DELETE | `/projects/:projectId/materials/:id` | Sửa/xóa vật tư dự án |
| GET/POST | `/projects/:id/progress` | Timeline/cập nhật tiến độ |
| GET/POST | `/projects/:id/files` | Danh sách/upload bản vẽ |
| GET/POST | `/projects/:id/images` | Gallery/upload nhiều ảnh |
| DELETE | `/files/:id` | Xóa tệp và metadata |
| DELETE | `/images/:id` | Xóa ảnh và metadata |

## Quản trị

- `GET /dashboard/summary`
- CRUD `/users`, kèm `PATCH /users/:id/reset-password`
- CRUD `/roles` (không xóa 3 role mặc định)
- `GET /contacts`, `PATCH /contacts/:id`, `DELETE /contacts/:id`

## Phân quyền

- `ADMIN`: toàn quyền.
- `PROJECT_MANAGER`: nghiệp vụ dự án, khách hàng, chủ đầu tư, hợp đồng, nhân sự, vật tư và hồ sơ.
- `TECHNICAL_STAFF`: chỉ xem dự án được phân công, upload hồ sơ/hình ảnh, cập nhật và xem lịch sử tiến độ. Kiểm tra quyền cuối cùng luôn ở backend.
