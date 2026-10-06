# Hướng dẫn tạo AWS RDS MySQL cho HDHOME

## Tổng quan

- **Dịch vụ:** AWS RDS MySQL 8.0 (Free Tier)
- **Chi phí:** Miễn phí 12 tháng (db.t3.micro, 20GB)
- **Kết nối:** Publicly accessible → Render và local đều truy cập được

---

## Bước 1: Tạo tài khoản AWS

1. Truy cập https://aws.amazon.com → **Create an AWS Account**
2. Điền email, password, thông tin cá nhân
3. Verify qua phone number + credit card (miễn phí, không bị trừ tiền)
4. Chọn **Basic Plan** (miễn phí)

---

## Bước 2: Tạo RDS MySQL Instance

1. Đăng nhập AWS Console → Search **"RDS"**
2. Click **Create database**

### Cấu hình:

| Trường | Giá trị |
|--------|---------|
| **Engine** | MySQL |
| **Version** | MySQL 8.0.35 (hoặc mới nhất) |
| **Template** | **Free tier** ✅ |
| **DB instance identifier** | `hdhome-db` |
| **Credential Settings** | |
| - Master username | `admin` |
| - Auto generate password | ❌ Bỏ tick → **tự đặt password** |
| **Connectivity** | |
| - Compute resource | **Don't connect to an EC2** |
| - VPC | **Default VPC** |
| - Public access | **Yes** ✅ |
| - VPC security group | **Create new** → tên: `hdhome-rds-sg` |
| **Database port** | `3306` |
| **Monitoring** | |
| - Enable Performance Insights | ❌ Disable (tiết kiệm) |
| **Additional configuration** | |
| - Initial database name | `hdhome` |
| - Backup | Disable automatic backups (demo) |

3. Click **Create database** (mất 5-10 phút)

---

## Bước 3: Lấy thông tin kết nối

Sau khi status = **Available**:

1. Click vào database `hdhome-db`
2. Tab **Connectivity & security** → copy **Endpoint** (dạng: `hdhome-db.xxxx.us-east-1.rds.amazonaws.com`)
3. Lưu lại:
   - **Endpoint**: `hdhome-db.xxxx.us-east-1.rds.amazonaws.com`
   - **Port**: `3306`
   - **Username**: `admin`
   - **Password**: (password đã đặt ở bước 2)
   - **DB name**: `hdhome`

---

## Bước 4: Mở Security Group cho kết nối

⚠️ **QUAN TRỌNG** — Security group mặc định chặn mọi kết nối.

1. AWS Console → EC2 → **Security Groups**
2. Tìm group `hdhome-rds-sg` (hoặc `default`)
3. Tab **Inbound rules** → **Edit inbound rules**
4. Thêm rule:
   - **Type:** MySQL/Aurora (port 3306)
   - **Source:** `0.0.0.0/0` (hoặc IP của bạn)
5. Save rules

---

## Bước 5: Test kết nối từ local

```powershell
# Kiểm tra MySQL client
mysql --version

# Test kết nối (thay YOUR_HOST, YOUR_PASSWORD)
mysql -h hdhome-db.xxxx.us-east-1.rds.amazonaws.com -P 3306 -u admin -p
# Gõ password → nếu vào được MySQL prompt = OK
```

Nếu `mysql` chưa có, cài XAMPP/WampServer → dùng MySQL client trong đó, hoặc:
```powershell
# Cài MySQL client qua Chocolatey
choco install mysql -y
```

---

## Bước 6: Import schema + seed

```powershell
cd d:\Dektop\HDhome\hdhome-project

.\import-aws-rds.ps1 `
    -DbHost "hdhome-db.xxxx.us-east-1.rds.amazonaws.com" `
    -DbPort 3306 `
    -DbUser "admin" `
    -DbPassword "YourPassword123!" `
    -DbName "hdhome"
```

**Output mong đợi:**
```
[1/4] Tao database `hdhome`...
  OK
[2/4] Xu ly schema.sql...
  OK
[3/4] Xu ly seed.sql...
  OK
[4/4] Import...
  OK
HOAN THANH! Database da duoc import thanh cong.
```

---

## Bước 7: Cập nhật env trên Render

1. Render Dashboard → Backend service → **Environment** → **Edit**
2. Cập nhật 6 biến:

| Key | Value |
|-----|-------|
| `DB_HOST` | `hdhome-db.xxxx.us-east-1.rds.amazonaws.com` |
| `DB_PORT` | `3306` |
| `DB_USER` | `admin` |
| `DB_PASSWORD` | `YourPassword123!` |
| `DB_NAME` | `hdhome` |
| `DB_SSL` | `false` |
| `AUTO_IMPORT_DB` | `false` ← tắt vì đã import ở bước 6 |

3. Click **Save Changes** → **Create Deploy** (deploy lại để nhận env mới)

---

## Bước 8: Verify

Sau khi deploy xong, test:

```powershell
# Test login admin
Invoke-RestMethod -Uri "https://hdhome-backend.onrender.com/api/auth/login" `
    -Method POST `
    -Body '{"username":"admin","password":"admin123"}' `
    -ContentType "application/json"

# Test login projectmanager
Invoke-RestMethod -Uri "https://hdhome-backend.onrender.com/api/auth/login" `
    -Method POST `
    -Body '{"username":"projectmanager","password":"Manager@123"}' `
    -ContentType "application/json"

# Test login technical
Invoke-RestMethod -Uri "https://hdhome-backend.onrender.com/api/auth/login" `
    -Method POST `
    -Body '{"username":"technical","password":"Technical@123"}' `
    -ContentType "application/json"
```

**Kết quả mong đợi:** mỗi lệnh trả về `{"success":true,"data":{"token":"..."}}`

---

## Tài khoản demo

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | ADMIN |
| `projectmanager` | `Manager@123` | PROJECT_MANAGER |
| `technical` | `Technical@123` | TECHNICAL_STAFF |

---

## Chi phí

| Resource | Usage | Cost |
|----------|-------|------|
| RDS db.t3.micro | 750h/tháng (luôn bật) | **$0** (Free Tier) |
| Storage 20GB SSD | 1 tháng | **$0** (Free Tier) |
| Backup storage | 0 GB | **$0** |
| **Total** | | **~$0/tháng** ✅ |

> ⚠️ **Lưu ý:** Free Tier hết sau 12 tháng hoặc nếu vượt giới hạn. AWS sẽ gửi email cảnh báo trước.

---

## Troubleshooting

### Lỗi "Connection refused"
→ Security group chưa mở port 3306. Vào EC2 Security Groups → thêm Inbound rule MySQL/Aurora từ 0.0.0.0/0.

### Lỗi "Host is blocked"
→ Nhiều failed connections → AWS tạm block. Đợi 1 phút hoặc vào RDS → **Modify** → tăm `Max_connections` parameter.

### Lỗi "Authentication protocol not supported"
→ AWS RDS MySQL 8 yêu cầu `caching_sha2_password`. MySQL client cũ (< 8.0) không hỗ trợ. Update MySQL client hoặc dùng `--default-auth=mysql_native_password`.

### Lỗi "Unknown database"
→ Database `hdhome` chưa được tạo. Chạy lại script import (bước 6) hoặc tạo thủ công:
```sql
CREATE DATABASE IF NOT EXISTS hdhome CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
