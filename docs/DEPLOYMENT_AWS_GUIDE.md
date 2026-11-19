# RecipeHub - Hướng Dẫn Triển Khai AWS EC2 & Vận Hành Production (Hạng mục 8 & 10)

Tài liệu hướng dẫn chi tiết quy trình triển khai toàn diện nền tảng **RecipeHub** (ASP.NET Core .NET 10 API + Next.js 16 Frontend + Cloud Neon PostgreSQL + Nginx Gateway) lên máy chủ đám mây AWS EC2.

---

## 1. Yêu Cầu Hạ Tầng & Chuẩn Bị (AWS EC2 Spec)

| Thông số | Cấu hình đề xuất (Production) | Ghi chú |
| :--- | :--- | :--- |
| **Hệ điều hành** | Ubuntu Server 24.04 LTS (64-bit x86) | Ổn định, hỗ trợ Docker Compose v2 native |
| **Instance Type** | `t3.medium` (2 vCPU, 4 GiB RAM) | Đảm bảo tải cho .NET 10 Kestrel và Next.js SSR |
| **Dung lượng ổ đĩa** | 30 GiB General Purpose SSD (`gp3`) | Đủ cho Docker images, logs và pg_dump backup |
| **Security Group** | Cổng `22` (SSH - giới hạn IP quản trị), `80` (HTTP), `443` (HTTPS) | Không mở cổng `8080`, `3000` ra ngoài Internet |
| **Cơ sở dữ liệu** | PostgreSQL 18.6 trên Cloud Neon | Kết nối qua TLS/SSL `Require`, pooled mode |

---

## 2. Các Bước Cài Đặt Ban Đầu Trên Máy Chủ EC2

### Bước 2.1: Kết nối SSH và cập nhật hệ điều hành
```bash
ssh -i "recipehub-key.pem" ubuntu@<EC2_PUBLIC_IP>

# Cập nhật packages
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw jq
```

### Bước 2.2: Cài đặt Docker Engine & Docker Compose
```bash
# Cài đặt Docker official repository
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Cấp quyền cho user ubuntu chạy docker không cần sudo
sudo usermod -aG docker ubuntu
newgrp docker
docker --version
```

### Bước 2.3: Thiết lập tường lửa UFW
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw --force enable
sudo ufw status verbose
```

---

## 3. Triển Khai Ứng Dụng RecipeHub Bằng Docker Compose

### Bước 3.1: Clone mã nguồn dự án
```bash
cd /home/ubuntu
git clone -b main https://github.com/khanh-workspace/Recipe-pp.git recipehub
cd recipehub
```

### Bước 3.2: Khởi tạo biến môi trường bí mật (`.env`)
> [!IMPORTANT]
> Tuyệt đối không commit file `.env` lên GitHub. Tạo trực tiếp trên máy chủ EC2.

```bash
cat << 'EOF' > .env
# ASP.NET Core & Amazon RDS PostgreSQL (thay bằng endpoint/user/password thực tế)
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Host=<RDS_ENDPOINT>;Port=5432;Database=<DB_NAME>;Username=<DB_USER>;Password=<DB_PASSWORD>;SSL Mode=Require;Pooling=true;Maximum Pool Size=30;

# JWT Authentication (tạo bằng: openssl rand -base64 64 | tr -d '\n')
Jwt__Key=<REPLACE_WITH_AT_LEAST_64_BYTE_RANDOM_SECRET>
Jwt__Issuer=RecipeHub
Jwt__Audience=RecipeHub.Web

# CORS (domain HTTPS thực tế của bạn)
Cors__AllowedOrigins__0=https://<YOUR_DOMAIN>

# Next.js Frontend Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_RESTORE_SESSION=true
EOF

chmod 600 .env
```

### Bước 3.3: Khởi động toàn bộ cụm dịch vụ (Fullstack Stack)
```bash
# Build và chạy ngầm cụm dịch vụ (Backend + Frontend + Nginx Gateway)
docker compose up -d --build

# Kiểm tra trạng thái các container
docker compose ps
```

Kết quả mong đợi:
```
NAME                 IMAGE                         STATUS                    PORTS
recipehub-api        recipehub-api:latest          Up (healthy)              127.0.0.1:8080->8080/tcp
recipehub-frontend   recipehub-frontend:latest     Up                        127.0.0.1:3000->3000/tcp
recipehub-gateway    nginx:1.27-alpine             Up                        0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

---

## 4. Kiểm Thử Khói (Smoke Test) & Nghiệm Thu Ngay Sau Triển Khai

Thực hiện kiểm tra trực tiếp từ máy chủ EC2 hoặc máy khách:

```bash
# 1. Kiểm tra Liveness probe Backend
curl -i http://localhost/health/live
# HTTP/1.1 200 OK -> Healthy

# 2. Kiểm tra Readiness probe (Xác thực kết nối Cloud Neon DB)
curl -i http://localhost/health/ready
# HTTP/1.1 200 OK -> Healthy

# 3. Kiểm tra API Recipes (301 món)
curl -s http://localhost/api/v1/recipes?pageSize=3 | jq .totalCount
# Trả về: 301

# 4. Kiểm tra Frontend Next.js SSR
curl -i http://localhost/ | head -n 15
# HTTP/1.1 200 OK (Có thẻ HTML và tiêu đề RecipeHub)
```

---

## 5. Tự Động Hóa Khởi Động (Systemd Service)

Đảm bảo khi máy chủ EC2 khởi động lại (Reboot) hoặc nâng cấp, cụm ứng dụng tự động chạy lại:

```bash
sudo tee /etc/systemd/system/recipehub.service > /dev/null << 'EOF'
[Unit]
Description=RecipeHub Fullstack Production Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/recipehub
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable recipehub.service
```

---

## 6. Lịch Sao Lưu Dữ Liệu Tự Động (Automated Nightly Backup)

Thiết lập cronjob sao lưu PostgreSQL (Amazon RDS) hằng ngày vào lúc 02:00 sáng (lưu thông tin kết nối trong `/home/ubuntu/.backup.env` với quyền `600`):

```bash
sudo mkdir -p /var/backups/recipehub
sudo chown ubuntu:ubuntu /var/backups/recipehub
sudo touch /var/log/recipehub_backup.log
sudo chown ubuntu:ubuntu /var/log/recipehub_backup.log

cat << 'EOF' > /home/ubuntu/.backup.env
DB_HOST=<RDS_ENDPOINT>
DB_USER=<DB_USER>
DB_NAME=<DB_NAME>
PGPASSWORD=<DB_PASSWORD>
EOF
chmod 600 /home/ubuntu/.backup.env

cat << 'EOF' > /home/ubuntu/recipehub/backup_nightly.sh
#!/bin/bash
set -euo pipefail
source /home/ubuntu/.backup.env
BACKUP_DIR="/var/backups/recipehub"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BASENAME="recipehub_backup_$TIMESTAMP.dump"

echo "[$(date)] Starting PostgreSQL Backup..."
docker run --rm \
  -v "$BACKUP_DIR:/backups" \
  -e PGPASSWORD="$PGPASSWORD" \
  -e PGSSLMODE=require \
  postgres:18-alpine \
  pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
          --no-owner --no-privileges -F c -f "/backups/$BASENAME"

echo "[$(date)] Backup completed successfully: $BACKUP_DIR/$BASENAME"

# Giữ lại các bản sao lưu trong 7 ngày gần nhất, xóa cũ hơn
find "$BACKUP_DIR" -name "*.dump" -mtime +7 -delete
EOF

chmod +x /home/ubuntu/recipehub/backup_nightly.sh

# Thêm vào crontab (tránh nhân bản dòng nếu chạy lại)
(crontab -l 2>/dev/null | grep -v "backup_nightly.sh"; echo "0 2 * * * /home/ubuntu/recipehub/backup_nightly.sh >> /var/log/recipehub_backup.log 2>&1") | crontab -
```

---

## 7. Quy Trình Rollback Khi Có Sự Cố (Emergency Rollback)

Nếu bản build mới gặp lỗi hoặc kiểm thử thất bại sau khi triển khai:

```bash
# 1. Quay lại commit ổn định trước đó
git checkout <PREVIOUS_COMMIT_SHA>

# 2. Re-build và khởi động lại phiên bản ổn định
docker compose up -d --build

# 3. Trường hợp cần phục hồi CSDL về bản snapshot:
# Dùng file dump gần nhất để khôi phục vào database đích
PGSSLMODE=require pg_restore -h <RDS_ENDPOINT> -U <DB_USER> -d <DB_NAME> --no-owner --no-privileges -c -v <BACKUP_FILE>.dump
```
