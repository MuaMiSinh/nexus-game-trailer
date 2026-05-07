# Deploy lên Vercel (Frontend only - dùng mock-data)

## 1) Chuẩn bị
- Đảm bảo bạn đã **push code lên GitHub** (Vercel sẽ deploy từ repo).
- Repo hiện có cả `server/` nhưng UI đang dùng `src/lib/mock-data.ts`, **không gọi API backend** ⇒ deploy nhanh nhất là **chỉ frontend**.

## 2) Tạo Project trên Vercel
1. Vào https://vercel.com/dashboard
2. Bấm **Add New… → Project**
3. Chọn repo của bạn
4. Ở màn hình cấu hình, chọn:
   - **Framework preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

> Nếu Vercel tự detect đúng, bạn chỉ cần bấm Deploy.

## 3) Deploy
- Bấm **Deploy**
- Chờ Vercel chạy xong build.

## 4) Kiểm tra nhanh route
Sau khi có URL Vercel, mở lần lượt:
- `/` (Home)
- `/game/<id>` (vd: `/game/cyberpunk-2077-phantom-liberty`)
- `/live` và `/live/<id>`
- `/auth`, `/admin` (nếu có UI đó)

## 5) Nếu bạn muốn backend thật (API + MySQL)
UI hiện tại chưa nối với `server/`. Khi bạn muốn dữ liệu thật từ API:
- Mình sẽ hướng dẫn deploy `server/` lên một nơi có Node chạy (Fly.io/Render/… hoặc Vercel serverless tùy setup)
- Đồng thời chỉnh frontend để gọi API thật qua một `API_BASE_URL`.
