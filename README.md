# Mini-Project: Quản Lý Danh Sách Sản Phẩm Bảo Mật (React + Express JWT)

Dự án thực hành môn học: Xây dựng tính năng xác thực và phân quyền bằng **JSON Web Token (JWT)** gồm 2 phần **Client (React + Vite)** và **Server (Node.js/Express)**.

---

## 📁 Cấu Trúc Dự Án

```
KTX3/
├── server/                             # Backend API (Node.js/Express)
│   ├── package.json
│   ├── middleware.js                   # Middleware phân quyền & xác thực JWT (xacThuc)
│   └── server.js                       # Cấu hình Express, CORS, POST /login, GET /api/products
│
├── client/                             # Frontend Web (React + Vite)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                     # Điều hướng có điều kiện LoginForm / ProductList
│       ├── App.css
│       ├── index.css
│       └── components/
│           ├── LoginForm.jsx           # Form đăng nhập, gửi POST /login, lưu token vào localStorage
│           └── ProductList.jsx         # 3 state (data, loading, error), useEffect gọi GET /api/products
│
├── BAO_CAO_MINI_PROJECT_JWT_SAN_PHAM.docx # File Word báo cáo hoàn chỉnh nộp bài
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Khởi chạy Backend (Port 3000)
```bash
cd server
npm install
node server.js
```
*Server sẽ chạy tại: `http://localhost:3000`*

### 2. Khởi chạy Frontend React (Port 5173)
Mở cửa sổ terminal thứ 2:
```bash
cd client
npm install
npm run dev
```
*Giao diện React sẽ chạy tại: `http://localhost:5173`*

---

## 🔑 Tài Khoản Kiểm Thử
- **Tài khoản đúng**:
  - Email: `admin@gmail.com`
  - Mật khẩu: `123456`
  - *Kết quả*: Đăng nhập thành công -> Cấp JWT Token -> Lưu localStorage -> Tải danh sách sản phẩm.
- **Tài khoản sai**:
  - Email bất kỳ khác hoặc mật khẩu sai
  - *Kết quả*: Trả về mã lỗi `401 Unauthorized` kèm thông báo đỏ.

---

## 🌐 Danh Sách API Backend

| Method | Endpoint | Yêu cầu xác thực | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Không | Kiểm tra trạng thái máy chủ (Health Check) |
| `POST` | `/login` | Không | Xác thực email/matKhau và trả về JWT token |
| `GET` | `/api/products` | **Bearer Token** | Route bảo mật: Trả về danh sách sản phẩm |
