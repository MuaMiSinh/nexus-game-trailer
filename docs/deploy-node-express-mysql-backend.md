# Deploy backend Node.js (Express) + MySQL (nhanh mượt - Render)

## 0) Kiểm tra cấu trúc project
- Backend nằm ở thư mục `server/`
- Script chạy backend:
  - `npm run start` (trong `server/package.json`)
- Backend đọc env theo ví dụ: `server/.env.example`

## 1) Chuẩn bị MySQL (Managed DB)
Tạo MySQL managed trên provider bạn chọn (Render Databases / Railway / etc.).
Bạn sẽ lấy các biến sau:
- `DB_HOST`
- `DB_PORT` (thường `3306`)
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## 2) Deploy backend lên Render (Web Service)
1. Render Dashboard → **New +** → **Web Service**
2. Connect GitHub repo
3. Thiết lập:
   - **Root directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
   - Render sẽ tự set `PORT`

4. Environment Variables (đặt đúng tên biến backend đang dùng):
   - `JWT_SECRET` = chuỗi random dài
   - `DB_HOST` = từ MySQL
   - `DB_PORT` = từ MySQL (vd `3306`)
   - `DB_USER` = từ MySQL
   - `DB_PASSWORD` = từ MySQL
   - `DB_NAME` = từ MySQL

> Backend hiện dùng `dotenv.config()` nên các biến env này là bắt buộc.

## 3) Test endpoint
Sau khi deploy, Render cung cấp URL kiểu:
- `https://your-backend.onrender.com`

Test:
- `GET /api/health`  → `{ ok: true, time: ... }`

## 4) Cấu hình Frontend (Vercel) trỏ sang backend
Frontend đang gọi API bằng `import.meta.env.VITE_API_BASE_URL` trong `src/lib/api.ts`.

Trên Vercel (cho project frontend), set:
- `VITE_API_BASE_URL=https://your-backend.onrender.com`

Sau đó deploy frontend lại.

## 5) CORS (nếu gặp lỗi)
Hiện backend có `app.use(cors());` nên thường không cần chỉnh.
Nếu bị CORS trong môi trường thật, mình sẽ hướng dẫn whitelist domain (Vercel) và cập nhật `server/src/index.js`.
