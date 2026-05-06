# NEXUS — Game Trailer Hub

Website giới thiệu trailer game phong cách **Neon Cyberpunk Dark UI** với hệ thống auth 27-class validation, admin dashboard, và livestream.

## 📦 Cấu trúc

```
nexus-game-trailer/
├── (frontend)        # React + Vite + Tailwind + Framer Motion + tsParticles
│   ├── src/
│   ├── package.json
│   └── ...
└── server/           # Node.js + Express + MySQL backend
    ├── src/
    ├── sql/schema.sql
    └── package.json
```

## 🚀 Cài đặt nhanh

### Yêu cầu
- **Node.js** ≥ 18 ([tải tại đây](https://nodejs.org))
- **MySQL** ≥ 8 ([tải MySQL Community Server](https://dev.mysql.com/downloads/mysql/) hoặc dùng [XAMPP](https://www.apachefriends.org))
- **VS Code** ([tải tại đây](https://code.visualstudio.com))

---

## 1️⃣ Setup Frontend

```bash
# Trong thư mục gốc nexus-game-trailer/
npm install
npm run dev
```
Mở trình duyệt: **http://localhost:8080**

> Frontend mặc định dùng mock data → bạn có thể xem ngay không cần backend.

---

## 2️⃣ Setup Backend (MySQL + Express)

### Bước 1: Khởi động MySQL
- **Windows (XAMPP)**: mở XAMPP Control Panel → Start MySQL
- **macOS**: `brew services start mysql`
- **Linux**: `sudo systemctl start mysql`

### Bước 2: Tạo database & cấu hình

```bash
cd server
npm install
cp .env.example .env
```

Mở file `server/.env` và sửa thông tin MySQL:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password   # mật khẩu MySQL của bạn
DB_NAME=nexus_db
JWT_SECRET=hãy-đổi-thành-chuỗi-ngẫu-nhiên-dài
```

### Bước 3: Tạo bảng & seed data

**Cách 1 — Dùng script tự động (khuyến nghị):**
```bash
npm run db:setup    # Tạo database + tất cả bảng
npm run db:seed     # Seed admin + demo user + 6 trailer mẫu
```

**Cách 2 — Chạy SQL thủ công bằng MySQL Workbench / phpMyAdmin:**
- Mở file `server/sql/schema.sql` và copy toàn bộ
- Paste vào MySQL Workbench → Execute

### Bước 4: Chạy backend
```bash
npm run dev
# 🚀 NEXUS API listening on http://localhost:4000
```

### Tài khoản mặc định sau khi seed
| Email | Password | Role |
|-------|----------|------|
| `admin@nexus.gg` | `Admin@123` | admin |
| `demo@gmail.com` | `User@123` | user |

---

## 🗄️ Schema Database

| Bảng | Mục đích |
|------|----------|
| `users` | Thông tin tài khoản (id, username, email, password_hash, ...) |
| `user_roles` | Phân quyền (`user`/`admin`) — bảng riêng để bảo mật |
| `trailers` | Game trailers (slug, title, video_url, views, ...) |
| `livestreams` | Livestream + stream_key cho OBS |
| `live_messages` | Chat realtime |
| `activity_logs` | Nhật ký hoạt động admin |

Xem chi tiết tại `server/sql/schema.sql`.

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` — Đăng ký
- `POST /api/auth/login` — Đăng nhập (trả về JWT)
- `GET  /api/auth/me` — Lấy user hiện tại

### Trailers
- `GET    /api/trailers?genre=&search=&sort=` — Danh sách + filter
- `GET    /api/trailers/:slug` — Chi tiết
- `POST   /api/trailers` 🔒 admin — Thêm
- `PUT    /api/trailers/:id` 🔒 admin — Sửa
- `DELETE /api/trailers/:id` 🔒 admin — Xóa

### Livestream
- `GET  /api/live` — Danh sách
- `POST /api/live` 🔒 — Tạo + lấy stream_key
- `GET  /api/live/:id/messages` — Chat history
- `POST /api/live/:id/messages` 🔒 — Gửi chat

### Admin
- `GET    /api/admin/users` — Danh sách user
- `PATCH  /api/admin/users/:id/ban` — Khóa/mở
- `PATCH  /api/admin/users/:id/role` — Đổi quyền
- `DELETE /api/admin/users/:id` — Xóa
- `GET    /api/admin/stats` — Dashboard stats
- `GET    /api/admin/logs` — Activity logs

🔒 = cần `Authorization: Bearer <JWT>`

---

## 🔌 Kết nối Frontend → Backend

## 🌐 Deploy lên GitHub + Railway

### 1) Push code lên GitHub
- Tạo repo trên GitHub (cùng chủ sở hữu)
- Push project:
  - `git init`
  - `git add .`
  - `git commit -m "init"`
  - `git branch -M main`
  - `git remote add origin <YOUR_GITHUB_REPO_URL>`
  - `git push -u origin main`

### 2) Chọn cách deploy (khuyến nghị: 2 services)
- **Service A (Backend):** Node.js/Express + MySQL (Railway Postgres/MySQL tùy bạn, nhưng backend đang dùng MySQL)
- **Service B (Frontend):** Vite build (serve static)
  
> Hiện project đang có backend ở `server/` và frontend ở root.

### 3) Backend (Railway Service A)
**Build/Start command (Railway)**
- Build: `npm install`
- Start: `npm run start`
- Working directory: `server/` (Railway thường cho chọn “Root Directory”)

**Environment variables (server)**
Lấy từ `server/.env.example` và set trên Railway:
- `PORT` (mặc định backend dùng 4000 nếu không set)
- `JWT_SECRET`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

**Database**
- Tạo database và đảm bảo backend connect được MySQL.
- Chạy seed/setup sau khi deploy lần đầu:
  - (tuỳ Railway) tạo “job”/command run: `npm run db:setup` và `npm run db:seed` trong thư mục `server/`
  - hoặc chạy tay trong Railway Shell (nếu có).

**Healthcheck**
- Backend có endpoint: `GET /api/health`

### 4) Frontend (Railway Service B)
**Build/Start command (Railway)**
- Build: `npm install && npm run build`
- Start: `npm run start`
- Root directory: project root (không vào `server/`)

**Environment variables (frontend)**
- `VITE_API_URL` = URL tới backend, ví dụ:
  - `http://<railway-backend-domain>/api`

> Lưu ý: frontend trong repo hiện đang có mock data. Nếu bạn đã đổi để gọi API thật, cần set `VITE_API_URL` chính xác.

### 5) Kiểm tra sau deploy
- Frontend chạy không lỗi console
- Backend trả đúng:
  - `GET /api/health`
  - `GET /api/trailers`


Hiện tại frontend dùng mock data trong `src/lib/mock-data.ts`. Để dùng API thật:

1. Tạo file `.env` trong thư mục gốc (cùng cấp `package.json`):
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```
2. Trong components, gọi API thay vì import mock data:
   ```ts
   const res = await fetch(`${import.meta.env.VITE_API_URL}/trailers`);
   const trailers = await res.json();
   ```

---

## 🎮 Hướng dẫn OBS Streaming (Tùy chọn)

Phần backend đã có schema livestream + stream_key. Để stream thực:

1. Setup **Nginx-RTMP** server (hoặc dùng Mux/Livepeer)
2. Trong OBS: Settings → Stream
   - Service: **Custom...**
   - Server: `rtmp://your-server.com/live`
   - Stream Key: lấy từ trang `/creator/live`

---

## 🎨 Stack chi tiết

**Frontend:** React 18, Vite 5, TypeScript, Tailwind CSS, Framer Motion, GSAP, tsParticles, React Hook Form + Zod, Recharts, Lucide React

**Backend:** Node.js, Express 4, MySQL 8 (mysql2), bcryptjs, jsonwebtoken, Zod

---

## 🛠️ Troubleshooting

**`ER_ACCESS_DENIED_ERROR`** → kiểm tra `DB_USER`/`DB_PASSWORD` trong `.env`

**`ECONNREFUSED 127.0.0.1:3306`** → MySQL chưa chạy. Khởi động qua XAMPP/services

**Port 4000 đã dùng** → đổi `PORT=4001` trong `server/.env`

**CORS error** → backend đã bật CORS toàn cục, kiểm tra `VITE_API_URL` đúng

---

## 📄 License
MIT — tự do sử dụng cho dự án cá nhân & học tập.

**Made with 💜 Neon Cyberpunk vibes**
